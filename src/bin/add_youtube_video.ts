#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander'

const program = new Command()

import * as models from '../models'

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

program.parse(process.argv)

