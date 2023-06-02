
import { log } from '../../log'

import * as models from '../../models'

import { getChannel } from 'rabbi'

const axios = require('axios')

export async function create(req) {


  log.info('jaas.8x8.vc.webhook', req.payload);

  (async () => {

    try {

      await models.Event.create({

        namespace: 'jaas.8x8.vc.pow.co',

        type: 'jaas.8x8.vc.webhook',

        payload: req.payload

      });

      const channel = await getChannel()

      channel.publish('powco', 'jaas.8x8.vc.webhook', Buffer.from(JSON.stringify(req.payload)))

      //await notifyRocketchat(req.payload)

    } catch(error) {

      log.error('notifyRocketchat.error', error)

    }

  })();

  return { success: true }

}

export async function createLiveapi(req) {


  log.info('liveapi.webhook', req.payload);

  (async () => {

    try {

      models.Event.create({

        namespace: 'liveapi',

        type: 'liveapi.webhook',

        payload: req.payload

      });

      const { event, payload } = req.payload

      models.Event.create({

        namespace: 'liveapi',

        type: event,

        payload

      });

      const channel = await getChannel()

      channel.publish('powco', 'liveapi.webhook', Buffer.from(JSON.stringify(req.payload)))

      channel.publish('powco', `liveapi.${event}`, Buffer.from(JSON.stringify(payload)))

    } catch(error) {

      log.error('notifyRocketchat.error', error)

    }

  })();

  return { success: true }

}

function notifyRocketchat(webhook) {

  const url = 'https://chat.21e8.tech/hooks/KB7fZ75PECiApFeDA/hdpTQovnGzSJmJPDMNg4bCPGPzHBvemnnJR3D2wfcPW7tez5'

  return axios.post(url, {
    "text": webhook
  })
}
