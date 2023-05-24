
import { log } from 'rabbi'

export const exchange = 'tokenmeet.live'

export const queue = 'publish_chat_messages_to_blockchain'

export const routingkey = 'jitsi-event.recorded'

import * as models from '../models'

import { onchain } from 'stag-wallet'

async function postRecordToBlockchain(json) {

  const record = await models.Event.findOne({ where:{ id: json.id }})

  const [blockchainRecord, isNew] = await onchain.findOrCreate({
    where: {
      app: 'tokenmeet.live',
      type: `jitsi.webhook.${record.eventType}`,
      content: {
        id: record.id
      }
    },
    defaults: {
      app: 'alpha.tokenmeet.live',
      key: 'jitsi-event.incomingMessage.',
      val: record.payload
    }

  })

  record.txid = record.txid

  await record.save()

  return [blockchainRecord, isNew]

}

export default async function start(channel, msg, json) {

  if (json.type !== 'incomingMessage') {

    return;

  }

  const [record, isNew] = await postRecordToBlockchain(json)

  console.log('onchpost.result', { record, isNew })
    
}
