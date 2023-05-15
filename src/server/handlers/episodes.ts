
import { createEpisode } from '../../episodes'

import { badRequest } from 'boom'

export async function create(req, h) {

  try {

    let episode = await createEpisode(req.payload)

    return { episode: episode.toJSON }

  } catch(error) {

    console.error('handlers.episodes.create.error', error.message)

    return badRequest(error)

  }

}
