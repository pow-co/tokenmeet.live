
const axios = require('axios')

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
