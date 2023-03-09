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

program
  .command('liveapi-upload-video <filepath>')
  .action(async (filepath) => {

    try {

      const result = await tokenmeet.liveapi.uploadLiveAPIVideo({
        filepath,
      })
      
      console.log({ result })


    } catch(error) {

      console.error(error)


    }

    process.exit(0)

  })



program
  .command('liveapi-post-video <url>')
  .action(async (input_url) => {

    try {

      const result = await tokenmeet.liveapi.createLiveapiVideoFromURL({
        input_url,
      })
      
      console.log({ result })


    } catch(error) {


    }

    process.exit(0)

  })

program
  .command('create-show <name> <stub>')
  .action(async (name, stub) => {

    try {

      const [record, isNew] = await models.Show.findOrCreate({
        where: { stub },
        defaults: { name, stub }
      })

      console.log(record.toJSON(), {isNew})

    } catch(error) {

      console.error(error.message)

    }

    process.exit(0)

  })

program
  .command('create-episode <show-stub> <title>')
  .action(async (stub, title) => {

    try {

      const [show, isNew] = await models.Show.findOrCreate({
        where: { stub },
        defaults: { stub }
      })

      const episode = await models.ShowEpisode.create({
        show_id: show.id,
        title
      })

      console.log(episode.toJSON())

    } catch(error) {

      console.error(error.message)

    }

    process.exit(0)

  })

program
  .command('set-episode-value <episode-id> <attribute> <value>')
  .action(async (id, key, value) => {

    try {

      const episode = await models.ShowEpisode.findOne({
        where: {
          id
        }
      })

      const update = {}
      update[key] = value

      await episode.updateAttributes(update)

      console.log(episode.toJSON())

    } catch(error) {

      console.error(error.message)

    }

    process.exit(0)

  })

program.parse(process.argv)

