
import { get } from 'https'

import { createWriteStream } from 'fs'

export async function downloadVideo({ url, filepath }: {url: string, filepath: string}): Promise<void> {

    const file = createWriteStream(filepath);
    const request = get(url, function(response) {
       response.pipe(file);

       // after download completed close filestream
       file.on("finish", () => {
           file.close();
           console.log("Download Completed");
         process.exit(0)
       });
    });

}
