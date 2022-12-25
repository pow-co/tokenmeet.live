
const Downloader = require("nodejs-file-downloader");

const S3 = require('aws-sdk').S3

const S3S = require('s3-streams');

import { createReadStream } from "fs";

(async () => {
  //Wrapping the code with an async function, just for the sake of example.
  //
    const url = 'https://objectstorage.us-ashburn-1.oraclecloud.com/p/bqZW7p5X2I7LZg1OqP_-UjdhDEpzbuUmD18OtwfqvBIqJW05y4bqqaZGgngAd_8t/n/fr4eeztjonbe/b/vpaas-recordings-prod-8x8-us-ashburn-1/o/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/waqcxosifleqyirx/sampleappworthytruthsclarifyclearly_2022-12-21-17-53-31.mp4'

  const downloader = new Downloader({
    url,
    directory: "./downloads", //This folder will be created, if it doesn't exist.
    onProgress: function (percentage, chunk, remainingSize) {
      //Gets called with each chunk.
      console.log("% ", percentage);
      console.log("Current chunk of data: ", chunk);
      console.log("Remaining bytes: ", remainingSize);
    },
  });



  
  try {
    const {filePath,downloadStatus} = await downloader.download(); //Downloader.download() resolves with some useful properties.
 
    var upload = S3S.WriteStream(new S3(), {
      Bucket: 'pow.co',
      Key: 'powco_recordings/my-key'
    });

    createReadStream(filePath).pipe(upload);

    var s3 = new S3();

    //configuring parameters
    var params = {
      Bucket: 'pow.co',
      Body : createReadStream(filepath),
      Key : "powco_recordings/"+Date.now()+"_"+path.basename(filepath)
    };

    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        console.log("Uploaded in:", data.Location);
      }
    });

    console.log("All done", {filePath});
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log("Download failed", error);
  }
})();
