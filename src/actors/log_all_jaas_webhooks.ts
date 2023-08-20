
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'log_jaas_webhooks'

export const routingkey = 'jaas.8x8.vc.webhook'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.notify_bitchat_on_recording_ended', {
    message: msg.content.toString(),
    json
  })

  console.log('JAAS_WEBHOOK', json)

}
