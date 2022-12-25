
const http = require('http'); 
const fs = require('fs');

import { resolve } from 'path'

import { createWriteStream } from 'fs'

const axios = require('axios')

async function downloadImage () {
    const url = 'https://objectstorage.us-ashburn-1.oraclecloud.com/p/bqZW7p5X2I7LZg1OqP_-UjdhDEpzbuUmD18OtwfqvBIqJW05y4bqqaZGgngAd_8t/n/fr4eeztjonbe/b/vpaas-recordings-prod-8x8-us-ashburn-1/o/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/waqcxosifleqyirx/sampleappworthytruthsclarifyclearly_2022-12-21-17-53-31.mp4'
 
    const path = resolve(__dirname, 'images', 'code.jpg')
    const writer = createWriteStream(path)
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
  
  

export async function main() {

    const url = 'https://objectstorage.us-ashburn-1.oraclecloud.com/p/bqZW7p5X2I7LZg1OqP_-UjdhDEpzbuUmD18OtwfqvBIqJW05y4bqqaZGgngAd_8t/n/fr4eeztjonbe/b/vpaas-recordings-prod-8x8-us-ashburn-1/o/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/waqcxosifleqyirx/sampleappworthytruthsclarifyclearly_2022-12-21-17-53-31.mp4'

    const file = fs.createWriteStream("file.jpg");
    const request = http.get(url, function(response) {
    response.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
        file.close();
        console.log("Download Completed");
    });
    });


}

if (require.main === module) {

    downloadImage()

    //main()
}