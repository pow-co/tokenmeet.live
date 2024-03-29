
import { log, publish } from 'rabbi'

export const exchange = 'tokenmeet.live'

export const queue = 'log_jitsi_events_to_database'

export const routingkey = 'jitsi-event'

import * as models from '../models'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.log_jitsi_events_to_database', {
    message: msg.content.toString(),
    json
  })
  const { type, event: payload } = json

  const record = await models.Event.create({
    namespace: 'jitsi-events',
    type,
    payload: json
  })

  publish(exchange, 'jitsi-event.recorded', record.toJSON())
    
}
