
import config from './config'

import { start as server } from './server'

import { start as actors } from './rabbi/actors'

import { schedule } from 'node-cron'

import { syncVideos as syncLiveapiVideos } from './liveapi'

export async function start() {

  if (config.get('http_api_enabled')) {

    server();

  }

  if (config.get('amqp_enabled')) {

    actors();

  }

  schedule('* * * * *', syncLiveapiVideos) // every minute

}

if (require.main === module) {

  start()

}
