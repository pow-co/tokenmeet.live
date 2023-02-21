
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'create_video_record_on_recording_started'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as models from '../models'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.create_video_record_on_recording_started', {
    message: msg.content.toString(),
    json
  })

  switch(json.eventType) {

    case 'RECORDING_STARTED':

        console.log('jitsi.webhooks.RECORDING_STARTED', json)

        const [video, isNew] = await models.Video.findOrCreate({
          where: {
            jitsi_session_id: json.sessionId
          },
          defaults: {
            jitsi_session_id: json.sessionId,
            startedAt: json.timestamp
          }
        })

        if  (isNew) {

          console.log('video.record.created', video.toJSON()) 

        } else {

          console.log('video.record.found', video.toJSON()) 

        }

        break;

    default:

        break;

  }

}

