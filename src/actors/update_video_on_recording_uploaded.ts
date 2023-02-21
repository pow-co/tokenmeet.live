
import { log, publish } from 'rabbi'

export const exchange = 'powco'

export const queue = 'update_video_on_recording_uploaded'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as models from '../models'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.update_video_on_recording_uploaded', {
    message: msg.content.toString(),
    json
  })

  if (!json || json.eventType !== 'RECORDING_UPLOADED') { return }

  console.log('jitsi.webhooks.RECORDING_UPLOADED', json)

  const video = await models.Video.findOne({
    where: {
      jitsi_session_id: json.sessionId
    }
  })

  if (!video) {

    console.error('jitsi.video.notFound', json)

    return

  } 

  if (video.jitsi_meet_8x8_url) {

    console.log('video.jitsi_meet_8x8_url.alreadySet', video.toJSON())

  } else {

    video.jitsi_meet_8x8_url = json.data.preAuthenticatedLink

    await video.save()

    console.log('video.jitsi_meet_8x8_url.updated', video.toJSON())

    publish(exchange, 'video.jitsi_meet_8x8_url.updated', video)

  }
}

