
import { findOrCreateLivestream } from '../../liveapi'

import { badRequest } from 'boom'

export async function show(req) {

  try {

    const { channel } = req.params

    const livestream = await findOrCreateLivestream({ channel })

    return { livestream }

  } catch(error) {

    return badRequest(error)

  }

}
