
import { log, publish } from 'rabbi'

export const exchange = 'powco'

export const queue = 'create_liveapi_video_from_url_on_recording_uploaded'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as liveapi from '../liveapi'

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

  if (video.liveapi_url) {

    console.log('video.liveapi_url.alreadySet', video.toJSON())

  } else {

    const result = await liveapi.createLiveapiVideoFromURL({

      input_url: video.jitsi_meet_8x8_url

    })

    video.liveapi_hls_url = result.playback.hls_url

    video.liveapi_embed_url = result.playback.embed_url

    await video.save()

    console.log('video.liveapi_url.updated', video.toJSON())

    publish(exchange, 'video.liveapi_url.updated', video)

  }

}

