require('dotenv').config()

import * as models from './src/models'

import { publish } from 'rabbi'

import { Op } from 'sequelize'

export async function main() {


  const records = await models.Event.findAll({

    where: {

      type: 'incomingMessage',
      
      txid: {

        [Op.eq]: null

      }

    }

  })

  for (let record of records) {

    console.log(record.toJSON())

    publish('tokenmeet.live', 'jitsi-event.recorded', record.toJSON())

  }

  setTimeout(() => { process.exit(0) }, 5200)

}

main()

