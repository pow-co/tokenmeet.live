
import { listLivestreams, getLivestream } from '../../liveapi'

import { badRequest } from 'boom'

export async function show(req) {

  try {

    const { id } = req.params

    const livestream = await getLivestream({ id })

    return { livestream }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function index(req) {

  try {

    const livestreams = await listLivestreams()

    return { livestreams }

  } catch(error) {

    return badRequest(error)

  }

}
