
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'publish_new_recordings_to_rocketchat'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as models from '../models'

import { notify } from '../rocketchat'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.publish_new_recordings_to_rocketchat', {
    message: msg.content.toString(),
    json
  })

  switch(json.eventType) {

    case 'RECORDING_UPLOADED':

        console.log('RECORDING_UPLOADED', json)

        notify('powco-development', `A New POWCO Club Video Room Recording Was Uploaded:\n\n ${json.data.preAuthenticatedLink}\n\nEnjoy!!\n\n(please note this link is only available for 24 hours)`);

        break;

    default:

        break;

  }

}

