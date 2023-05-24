
export const routingkey = 'liveapi.webhook'

export default async function start(channel, msg, json) {

  const { event } = json

  if (event) {

    console.log(`liveapi.webhook.${event}`, json)

    channel.publish('powco', `liveapi.webhook.${event}`, msg.content)

  }

}

