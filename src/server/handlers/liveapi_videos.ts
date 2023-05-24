
import { getVideo, listVideosByChannel } from '../../liveapi'

import { badRequest } from 'boom'

export async function show(req) {

  try {

    const { video_id } = req.params

    const video = await getVideo({ video_id })

    return { video }

  } catch(error) {

    return badRequest(error)

  }

}

export async function index(req) {

  try {

    const { channel } = req.params

    const videos = await listVideosByChannel({ channel })

    return { channel, videos }

  } catch(error) {

    return badRequest(error)

  }

}
