require('dotenv').config()

/**
 *
 * Liveapi Resources:
 *
 * - https://docs.liveapi.com/docs
 *
 */

const axios = require('axios')

import { createReadStream } from "fs";

const FormData = require('form-data')

import * as models from './models'

import { getChannel } from 'rabbi'

import { log } from './log'

export async function createLiveapiVideoFromURL({ input_url }: { input_url: string }) {

  console.log('liveapi.video.create', { input_url })

  const { data } = await axios.post('https://api.liveapi.com/videos', {
    input_url
  }, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  console.log('liveapi.video.create.response', { input_url, data })

  return data

}

type LiveapiVideo = any

export async function uploadLiveAPIVideo({ filepath }: { filepath: string }) {

  console.log('liveapi.video.create', { filepath })

  const { data } = await axios.post('https://api.liveapi.com/videos', {}, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  console.log({ data })

  const { _id } = data

  console.log({ _id })

  const { data: { url } } = await axios.post(`https://api.liveapi.com/videos/${_id}/uploads`, {}, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  console.log({ url })

  const stream = createReadStream(filepath)

  const formData = new FormData()
  formData.append('file', stream)

  const { data: result } = await axios.post(url, formData, {
    headers: formData.getHeaders()
  })

  console.log(result)

  console.log('liveapi.video.create.response', { _id, url })

  return { _id, url }

}

export async function findOrCreateLivestream({channel}: { channel: string }) {

  let record = await models.LiveStream.findOne({
    where: {
      channel
    }
  })

  if (!record) {

    const { data } = await axios.post(`https://api.liveapi.com/live_streams`, {}, {
      auth: {
        username: process.env.liveapi_access_token_id_production,
        password: process.env.liveapi_secret_key_production
      }
    })

    record = await models.LiveStream.create({
      channel,
      liveapi_data: data
    })

  }

  if (record) {

    return record

  }

}

type integer = number;

export interface TemporaryRecording {
  _id: string;
  stream_key: string;
  start_time: string;
  end_time: string;
  export_data: {
      from: string;
      duration: integer;
      bytes: integer;
      status: string;
      video_id: string;
      download_url: string;
  }[],
  duration: number;
  playback: {
    temporary_playback: string;
  },
  download_url: string;

}

export async function getTemporaryRecordings({livestream_id}: { livestream_id: string }): Promise<TemporaryRecording[]> {

  const { data } = await axios.get(`https://api.liveapi.com/live_streams/${livestream_id}/temporary_recordings`, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  await Promise.all(data.map(async temporaryRecording => {

    const [record, isNew] = await models.LiveapiTemporaryRecording.findOrCreate({
      where: {
        _id: temporaryRecording._id
      },
      defaults: temporaryRecording
    })

    if (isNew) {

      const channel = await getChannel()

      channel.publish('tokenmeet.live', 'liveapi.recording.temporary.created', record.toJSON())

      log.info('liveapi.temporaryRecording.created', record.toJSON())

    }

  }))

  return data

}

interface ConvertTemporaryRecordingResponse {
    from: string;
    duration:integer;
    bytes: integer;
    status: string;
    download_url: string | null;
}

export async function convertTemporaryRecording({ livestream_id, id, from, duration }: {livestream_id: string, id: string, from: string, duration: integer}): Promise<ConvertTemporaryRecordingResponse> {

  const { data } = await axios.post(`https://api.liveapi.com/live_streams/${livestream_id}/temporary_recordings/${id}`, {
    from,
    duration
  }, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })
  
  return data

}

export async function getVideo({ video_id }: { video_id }): Promise<LiveapiVideo> {

  let record = await models.LiveapiVideo.findOne({ where: { _id: video_id }})

  if (!record) {

    const { data } = await axios.get(`https://api.liveapi.com/videos/${video_id}`, {
      auth: {
        username: process.env.liveapi_access_token_id_production,
        password: process.env.liveapi_secret_key_production
      }
    })

    record = models.LiveapiVideo.create(data)

  }
  
  return record

}
export async function listVideosByChannel({ channel }: {channel: string}): Promise<LiveapiVideo[]> {

  return models.LiveapiVideo.findAll({
    where: { channel }
  })

}

export async function listVideos(): Promise<LiveapiVideo[]> {


  return models.LiveapiVideo.findAll()

}

export async function syncVideos(): Promise<LiveapiVideo[]> {

  let videos = []

  let page = 1

  let lastPage = false

  while (!lastPage) {

    const { data } = await axios.get(`https://api.liveapi.com/videos?page=${page}`, {
      auth: {
        username: process.env.liveapi_access_token_id_production,
        password: process.env.liveapi_secret_key_production
      }
    })

    videos = [...videos, ...data.docs]

    lastPage = page == data.pages

    page = data.page + 1

  }

  for (let video of videos) {

    let [record, isNew] = await models.LiveapiVideo.findOrCreate({
      where: {
        _id: video._id
      },
      defaults: video
    })

    if (isNew) {

      log.info('liveapi.video.created', record.toJSON())

    }

  }

  return videos

}

export const WebhookEvents = {
  'video-created': true,
  'video-ready': true,
  'video-downloaded': true,
  'video-removed': true,
  'stream-created': true,
  'stream-connected': true,
  'stream-disconnected': true,
  'stream-status-toggle': true,
  'stream-removed': true,
  'recording-exported': true,
  'stream-platform-added': true,
  'stream-platform-connected': true,
  'stream-platform-disconnected': true,
  'stream-platform-removed': true
}

