require('dotenv').config()

const axios = require('axios')

import { createReadStream } from "fs";

const FormData = require('form-data')

import * as models from './models'

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

    return record.liveapi_data

  }

}

