
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
      payload: Joi.object({
        paymail: Joi.string().required(),
        token: Joi.string().required(),
        wallet: Joi.string().required(),
        roomPaymail: Joi.string().optional(),
        tokenOrigin : Joi.string().optional(),
        room1Name: Joi.string().optional(),
        roomMinimumAmount: Joi.number().required()
      }).label('AuthTokensCreatePayload')
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
      host: 'http://localhost:8000',
      documentationPath: '/',
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
