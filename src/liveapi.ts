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

type Livestream = any

export async function getLivestream({ id }: {id: string}): Promise<Livestream> {

  const { data } = await axios.get(`https://api.liveapi.com/live_streams/${id}`, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  return data


}
export async function listLivestreams(): Promise<Livestream[]> {

  const { data } = await axios.get('https://api.liveapi.com/live_streams', {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  return data

}

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
export async function getTemporaryRecording({livestream_id, _id}: { livestream_id: string, _id: string }): Promise<TemporaryRecording> {

  const { data } = await axios.get(`https://api.liveapi.com/live_streams/${livestream_id}/temporary_recordings/${_id}`, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  return data

}



export async function getTemporaryRecordings({livestream_id}: { livestream_id: string }): Promise<TemporaryRecording[]> {

  const { data } = await axios.get(`https://api.liveapi.com/live_streams/${livestream_id}/temporary_recordings`, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  const livestream = await models.LiveStream.findOne({ where: { liveapi_data: { _id: livestream_id }}})

  if (!livestream) { throw new Error('livestream not found') }

  const { channel } = livestream

  return Promise.all(data.map(async temporaryRecording => {

    const [record, isNew] = await models.LiveapiTemporaryRecording.findOrCreate({
      where: {
        _id: temporaryRecording._id
      },
      defaults: Object.assign(temporaryRecording, {
        channel,
        livestream_id
      })
    })

    if (isNew) {

      const channel = await getChannel()

      channel.publish('tokenmeet.live', 'liveapi.recording.temporary.created', record.toJSON())

      log.info('liveapi.temporaryRecording.created', record.toJSON())

    }

    return record

  }))

}

interface ConvertTemporaryRecordingResponse {
    from: string;
    duration:integer;
    bytes: integer;
    status: string;
    download_url: string | null;
}

export async function createVideoFromTemporaryRecording({ _id }: {_id: string }): Promise<LiveapiVideo> {

  const record = await models.LiveapiTemporaryRecording.findOne({ where: { _id }})

  if (!record) { throw new Error('temporary recording not found') }

  if (record.video_id) {

    return getVideo({ video_id: record.video_id })

  }

  if (!record.download_url) { throw new Error('temporary recording record is missing download_url') }

  const { data } = await axios.post(`https://api.liveapi.com/videos`, {
    input_url: record.download_url
  }, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  const video_id = data._id

  record.video_id = video_id

  record.convert_requested_at = new Date()

  await record.save()

  const video = await getVideo({ video_id })

  video.channel = record.channel

  video.livestream_id = record.livestream_id

  await video.save()

  return video

}

export async function convertTemporaryRecording({ _id }: {_id: string }): Promise<ConvertTemporaryRecordingResponse> {

  const record = await models.LiveapiTemporaryRecording.findOne({ where: { _id }})

  if (!record) { throw new Error('temporary recording not found') }

  const { data } = await axios.post(`https://api.liveapi.com/live_streams/${record.livestream_id}/temporary_recordings/${_id}`, {
    from: record.start_time,
    duration: record.duration
  }, {
    auth: {
      username: process.env.liveapi_access_token_id_production,
      password: process.env.liveapi_secret_key_production
    }
  })

  console.log('liveapi.convertTemporaryRecording.result', data)

  record.conversion_requested_at = new Date()

  await record.save()
  
  return record

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

