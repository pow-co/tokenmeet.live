
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'notify_rocketchat_on_new_liveapi_video_created'

export const routingkey = 'video.liveapi_url.updated'

import * as models from '../models'

import { notify } from '../rocketchat'

export default async function start(channel, msg, json) {

  console.log('rabbi.actor.notify_rocketchat_on_new_liveapi_video_uploaded', json)

  notify('powco-development', `You may now stream the previous video online here: ${json.liveapi_embed_url}`);

}

