
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

import { plugin as socketio } from './socket.io/plugin'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

}

server.route({
  method: 'GET',
  path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

const Liveread = Joi.object({
  txid: Joi.string().required(),
  txix: Joi.string().required(),
  sponsor: Joi.string().required(),
  host: Joi.string().required(),
  commentary: Joi.string().required()
})



server.route({
  method: 'GET',
  path: '/api/v1/livereads',
  handler: handlers.Livereads.index,
  options: {
    description: 'Returns List of Livereads',
    tags: ['api', 'livereads'],
    validate: {
      query: Joi.object({
        host: Joi.string().optional(),
        sponsor: Joi.string().optional(),
        spent: Joi.boolean().optional(),
        spent_method: Joi.string().optional(),
        order: Joi.string().optional(),
        limit: Joi.number().optional(),
        offset: Joi.number().optional()
      }).optional()
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        livereads: Joi.array().items(Liveread)
      }).label('Liveread')
    }

  }
})

server.route({
  method: 'GET',
  path: '/api/v1/livereads/{txid}',
  handler: handlers.Livereads.show,
  options: {
    description: 'Returns Single of Liveread',
    tags: ['api', 'livereads'],
    validate: {
      params: Joi.object({
        txid: Joi.string().required()
      })
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        liveread: Liveread
      }).label('Livereads')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/livereads',
  handler: handlers.Livereads.createByTxhex,
  options: {
    description: 'Returns List of Livereads',
    tags: ['api', 'livereads'],
    validate: {
      payload: Joi.object({
        txhex: Joi.string().required()
      })
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
        livereads: Joi.array().items(Liveread)
      }).label('Livereads')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/episodes',
  handler: handlers.Episodes.create,
  options: {
    description: 'Create a new Episode for a Show',
    tags: ['api', 'episodes'],
    validate: {
      payload: Joi.object({
        channel: Joi.string().required(),
        title: Joi.string().required(),
        date: Joi.date().required(),
        token_origin: Joi.string().optional()
      })
    },
    response: {
      failAction: 'log',
      schema: Joi.object({
          episode: Joi.object({
          id: Joi.number().required(),
          show_id: Joi.number().required(),
          title: Joi.string().required(),
          date: Joi.date().required(),
          hls_live_url: Joi.string().required(),
          token_origin: Joi.string().optional()
        })
      }).label('Episode')
    }
  }
})



server.route({
  method: 'GET',
  path: '/api/v1/shows',
  handler: handlers.Shows.index,
  options: {
    description: 'Returns List of Shows',
    tags: ['api', 'shows']
  }
})

const Video = Joi.object({
  _id: Joi.string().required(),
  playback: Joi.object({
    embed_url: Joi.string(),
    hls_url: Joi.string()
  }),
  download_url: Joi.string(),
  user: Joi.string(),
  environment: Joi.string(),
  organization: Joi.string(),
  media_info: Joi.object({
    duration: Joi.number(),
    track: Joi.array()
  }),
  creation_time: Joi.string(),
  active: Joi.boolean(),
  deleted: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
})

server.route({
  method: 'GET',
  path: '/api/v1/liveapi/videos/{video_id}',
  handler: handlers.LiveapiVideos.show,
  options: {
    description: 'Returns A Single Liveapi Video',
    tags: ['api', 'liveapi'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        video: Joi.object({})
      }).label('Videos')
    }
  }
})



server.route({
  method: 'GET',
  path: '/api/v1/videos',
  handler: handlers.Videos.index,
  options: {
    description: 'Returns List of Videos',
    tags: ['api', 'videos'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        videos: Joi.array().items(Video)
      }).label('Videos')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/videos/{_id}',
  handler: handlers.Videos.show,
  options: {
    description: 'Returns List of Videos',
    tags: ['api', 'videos'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        video: Video
      }).label('Videos')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/shows/{stub}',
  handler: handlers.Shows.show,
  options: {
    description: 'Returns Show and its Episodes',
    tags: ['api', 'shows']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/liveapi/channels/{channel}/videos',
  handler: handlers.LiveapiVideos.index,
  options: {
    description: 'List all Liveapi Videos for a Channel',
    tags: ['api', 'liveapi']
  }
})



server.route({
  method: 'GET',
  path: '/api/v1/livestreams/{channel}',
  handler: handlers.LiveStreams.show,
  options: {
    description: 'Get LiveStream data for a given channel',
    tags: ['api', 'livestreams']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/jaas/events',
  handler: handlers.Events.index,
  options: {
    description: 'List events optionally filtered by json eventType',
    tags: ['api', 'events'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        events: Joi.array().required()
      }).label('Events')
    }
  }
})


server.route({
  method: 'POST',
  path: '/api/v1/jaas/auth',
  handler: handlers.AuthTokens.create,
  options: {
    description: 'Trade Relay Token for Jitsi JWT',
    tags: ['api', 'auth', 'tokens'],
    validate: {
      /*payload: Joi.object({
        paymail: Joi.string().required(),
        token: Joi.string().required(),
        wallet: Joi.string().required(),
        roomPaymail: Joi.string().optional(),
        tokenOrigin : Joi.string().optional(),
        room1Name: Joi.string().optional(),
        roomMinimumAmount: Joi.number().optional()
      }).label('AuthTokensCreatePayload')*/
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/jaas/webhooks',
  handler: handlers.Webhooks.create,
  options: {
    description: 'Receive Webhook About Jitsi Meet Events',
    tags: ['api', 'webhooks'],
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/liveapi/webhooks',
  handler: handlers.Webhooks.createLiveapi,
  options: {
    description: 'Receive Webhook About Liveapi Meet Events',
    tags: ['api', 'webhooks'],
  }
})



var started = false

export async function start() {

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'API Docs',
        version: Pack.version,
        description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
      },
      schemes: ['https'],
      host: 'tokenmeet.live',
      documentationPath: '/api',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    await server.register(socketio);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
