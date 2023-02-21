
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'update_video_on_recording_ended'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as models from '../models'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.update_video_on_recording_ended', {
    message: msg.content.toString(),
    json
  })

  if (!json || json.eventType !== 'RECORDING_ENDED') { return }

  console.log('jitsi.webhooks.RECORDING_ENDED', json)

  const video = await models.Video.findOne({
    where: {
      jitsi_session_id: json.sessionId
    }
  })

  if (!video) {

    console.error('jitsi.video.notFound', json)

    return

  } 

  if (video.endedAt) {

    console.log('video.endedAt.alreadySet', video.toJSON())

  } else {

    video.endedAt = json.timestamp

    await video.save()

    console.log('video.endedAt.updated', video.toJSON())

  }
}

