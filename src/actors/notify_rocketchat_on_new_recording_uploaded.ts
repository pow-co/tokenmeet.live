
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'notify_rocketchat_on_new_recording_uploaded'

export const routingkey = 'video.s3_url.updated'

import * as models from '../models'

import { notify } from '../rocketchat'

export default async function start(channel, msg, json) {

  console.log('rabbi.actor.notify_rocketchat_on_new_recording_uploaded', json)

  notify('powco-development', `A New POWCO Club Video Room Recording Was Uploaded:\n\n ${json.s3_url}\n\nEnjoy!!`);

}

