require('dotenv').config()

import * as models from './src/models'

import { getChannel } from 'rabbi'

async function main() {

  const webhooks = await models.Event.findAll({
    where: {
      type: 'jaas.8x8.vc.webhook'
    }
  })

  for (let webhook of webhooks) {

    const channel = await getChannel()

    channel.sendToQueue('publish_new_recordings_to_rocketchat', Buffer.from(JSON.stringify(webhook.payload)))

    console.log(webhook.payload)

  }

  setTimeout(() => process.exit(0), 5200)

}

main()
