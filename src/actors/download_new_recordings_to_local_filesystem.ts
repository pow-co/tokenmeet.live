
import { log } from 'rabbi'

import * as path from 'path'

const S3 = require('aws-sdk').S3

const S3S = require('s3-streams');

import { createReadStream } from "fs";

export const exchange = 'powco'

export const queue = 'download_new_recordings_to_local_filesystem'

export const routingkey = 'jaas.8x8.vc.webhook'

const Downloader = require("nodejs-file-downloader");

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.publish_new_recordings_to_rocketchat', {
    message: msg.content.toString(),
    json
  })

  switch(json.eventType) {

    case 'RECORDING_UPLOADED':

        console.log('RECORDING_UPLOADED', json)

          const downloader = new Downloader({
            url: json.data.preAuthenticatedLink,
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

              //configuring parameters
              var params = {
                Bucket: 'pow.co',
                Body : createReadStream(filePath),
                Key : "powco_recordings/"+Date.now()+"_"+path.basename(filePath),
                ACL:'public-read'
              };

              console.log('s3.upload.start', params)

              s3.upload(params, function (err, data) {
                //handle error
                if (err) {
                  console.error('s3.upload.error', err)
                  console.log("Error", err);
                }

                //success
                if (data) {

                  console.log('s3.upload.success', { params, data })
                  console.log("Uploaded in:", data.Location);
                }
              });

              console.log("All done", {filePath});
            } catch (error) {
              //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
              //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
              console.log("Download failed", error);
            }

        break;

    default:

        break;

  }

}

