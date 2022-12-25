
require("dotenv").config()

import * as talkers from './src/talkers'

async function main() {

  try {

    const result = await talkers.listAudioMutStatusChanged({ paymail: 'elliswyatt@relayx.io' })

    console.log('result', result)

    for (let update of result) {

      console.log({ update: update.toJSON() })

    }
  } catch(error) {

    console.error('error', error)
  }

}

main()

