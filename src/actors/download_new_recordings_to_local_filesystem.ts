
import { log, publish } from 'rabbi'

import * as path from 'path'

const S3 = require('aws-sdk').S3

const S3S = require('s3-streams');

import { createReadStream } from "fs";

import * as models from '../models'

export const exchange = 'powco'

export const queue = 'download_new_recordings_to_local_filesystem'

export const routingkey = 'video.jitsi_meet_8x8_url.updated'

const Downloader = require("nodejs-file-downloader");

export default async function start(channel, msg, json) {

  console.log('rabbi.actor.download_new_recordings_to_local_filesystem', json)

  const video = await models.Video.findOne({ where: { 
    jitsi_session_id: json.jitsi_session_id
  }})

  if (!video || !video.jitsi_meet_8x8_url) { return }

  const downloader = new Downloader({
    url: video.jitsi_meet_8x8_url,
    directory: "./downloads", //This folder will be created, if it doesn't exist.
    onProgress: function (percentage, chunk, remainingSize) {
      //Gets called with each chunk.
      console.log("% ", percentage);
      console.log("Remaining bytes: ", remainingSize);
    },
  });

  try {
      const {filePath,downloadStatus} = await downloader.download(); //Downloader.download() resolves with some useful properties.

      console.log({ filePath, downloadStatus })
   
      var upload = S3S.WriteStream(new S3(), {
        Bucket: 'pow.co',
        Key: 'powco_recordings/my-key'
      });

      createReadStream(filePath).pipe(upload);

      var s3 = new S3();

      //configuring parametrs
      var params = {
        Bucket: 'pow.co',
        Body : createReadStream(filePath),
        Key : "powco_recordings/"+Date.now()+"_"+path.basename(filePath),
        ACL:'public-read'
      };

      console.log('s3.upload.start', params)

      var s3EventPublished: boolean = false

      s3.upload(params, async function (err, data) {
        //handle error
        if (err) {
          console.error('s3.upload.error', err)
          console.log("Error", err);
        }

        //success
        if (data) {

          console.log('s3.upload.success', { params, data })
          console.log("Uploaded in:", data.Location);

          video.s3_url = data.Location

          await video.save()

          console.log("SAVED VIDEO", video.toJSON())

          if (!s3EventPublished) {

            console.log("PUBLISH SAVED VIDEO", video.toJSON())

            publish(exchange, 'video.s3_url.updated', video.toJSON())

            s3EventPublished = true

          }
        }
      });

      console.log("All done", {filePath});
    } catch (error) {
      //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
      //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
      console.log("Download failed", error);
    }
}

