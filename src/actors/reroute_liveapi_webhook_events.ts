
export const routingkey = 'liveapi.webhook'

import models from '../models'

export default async function start(channel, msg, json) {

  const { event, payload } = json

  if (event && payload) {

    console.log(`liveapi.webhook.${event}`, json)

    channel.publish('powco', `liveapi.webhook.${event}`, msg.content)

    const record = await models.LiveapiWebhook.create({
      event,
      payload
    })

    console.log("liveapi.webhook.recorded", record.toJSON())

  }

}

