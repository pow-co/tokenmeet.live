
import { getTemporaryRecordings, getTemporaryRecording, createVideoFromTemporaryRecording } from '../../liveapi'

import { badRequest, notFound } from 'boom'

export async function index(req) {

  try {

    const { livestream_id } = req.params

    const temporary_recordings = await getTemporaryRecordings({ livestream_id })

    return { temporary_recordings }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function show(req) {

  try {

    const { livestream_id, _id } = req.params

    const temporary_recording = await getTemporaryRecording({ livestream_id, _id })

    return { temporary_recording }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function convert(req) {

  try {

    const video = await createVideoFromTemporaryRecording(req.params._id)

    return { video }


  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}
