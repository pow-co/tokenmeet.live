#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander'

const program = new Command()

import * as models from '../models'

import * as tokenmeet from '../'

program
  .command('add_youtube_video <title> <youtube_url>')
  .action(async (title, youtube_url) => {

    const [video, isNew] = await models.Video.findOrCreate({
      where: {
        youtube_url
      },
      defaults: {
        youtube_url,
        title
      }
    })

    if (isNew) {

      console.log('video.created', video.toJSON())
      console.log('new video recorded in database')
      
    } else {

      console.log('video', video.toJSON())
      console.log('video already recorded in database')

    }

    process.exit(0)

  })

/**
 *
 * tokenmeet auth-paymail my-room paymail@relayx.io
 *
 * returns a jitsi JWT authenticated as that paymail user
 *
 */
program
  .command('auth-paymail <room> <paymail>')
  .action(async (room, paymail) => {

    try {

      const jwt = await tokenmeet.jwt.generate({
        room,
        paymail
      })
      
      console.log({ jwt })


    } catch(error) {


    }

    process.exit(0)

  })

program.parse(process.argv)

