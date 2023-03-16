
import { badRequest } from 'boom'

import { listVideos, getVideo } from '../../liveapi'

import { log } from '../../log'

export async function index() {

  try {

    const videos = await listVideos()

    return { videos } 

  } catch(error) {

    log.error('server.handlers.videos.index.error', error)

    badRequest(error)

  }

}


export async function show(req) {

  try {

    const { _id } = req.params

    const video = await getVideo({ video_id: _id })

    return { video } 

  } catch(error) {

    log.error('server.handlers.videos.show.error', error)

    badRequest(error)

  }

}
