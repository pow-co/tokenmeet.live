
require('dotenv').config()
const Downloader = require("nodejs-file-downloader");

import { publish } from 'rabbi'

const S3 = require('aws-sdk').S3

const S3S = require('s3-streams');

import { createReadStream } from "fs";

var fs = require('fs');

import { join, basename } from 'path'

var progress = require('progress-stream');

const stream = require('stream')

const passthrough = new stream.PassThrough();

import * as models from './src/models'

async function main () {

  const url = 'https://objectstorage.us-ashburn-1.oraclecloud.com/p/bqZW7p5X2I7LZg1OqP_-UjdhDEpzbuUmD18OtwfqvBIqJW05y4bqqaZGgngAd_8t/n/fr4eeztjonbe/b/vpaas-recordings-prod-8x8-us-ashburn-1/o/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/waqcxosifleqyirx/sampleappworthytruthsclarifyclearly_2022-12-21-17-53-31.mp4'

  const event = await models.Event.findOne({
    where: {
      payload: {
        eventType: 'RECORDING_UPLOADED'
      }
    },
    order: [['createdAt', 'DESC']]
  })

  const videoUrl = event.payload.data.preAuthenticatedLink

  console.log('EVENT', event.toJSON())

  var [video] = await models.Video.findOrCreate({
    where: {
      event_id: event.id
    }
  })

  if (video && video.s3_url) {
    console.log('Video already uploaded to S3')
    return 
  }

  //return

  try {

    const filepath = join(__dirname, 'downloads', 'sampleappworthytruthsclarifyclearly_2022-12-21-17-53-31.mp4')

    console.log({ filepath })
 
    var upload = S3S.WriteStream(new S3(), {
      Bucket: 'pow.co',
      Key: `powco_recordings/${Date.now()+"_"+basename(filepath)}.mp4`
    });

    var stat = fs.statSync(filepath);

    var str = progress({
      length: stat.size,
      time: 100 /* ms */
    });

    str.on('progress', function(progress) {
      console.log(progress);
    });

    var s3 = new S3();

    var params = {
      Bucket: 'pow.co',
      Body : createReadStream(filepath),
      Key : "powco_recordings/"+Date.now()+"_"+basename(filepath)
    };

    s3.upload(params, async function (err, data) {

      console.log('s3.upload.success', data)
      //handle error
      if (err) {
        console.log("Error", err);
      }

      console.log('s3.upload.success', data)

      video.s3_url = data.Location
      
      await video.save()

      publish('tokenmeet.live', 'jitsi-recording-uploaded-s3', video.toJSON())

      console.log('jitsi-recording-uploaded-s3', video.toJSON())

    });

  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log("Download failed", error);
  }


}

main()
