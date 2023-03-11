
import { findOrCreateLivestream } from '../../liveapi'

import { badRequest } from 'boom'

export async function show(req) {

  try {

    const { channel } = req.params

    const liveapi_data = await findOrCreateLivestream({ channel })

    return liveapi_data

  } catch(error) {

    return badRequest(error)

  }

}
