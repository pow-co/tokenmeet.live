
import { getVideo, listVideosByChannel } from '../../liveapi'

import * as models from '../../models'

import { badRequest } from 'boom'

export async function show(req) {

  try {

    const { channel } = req.params

    const show = await models.Show.findOne({
	    where: { channel }
    })

    const promises = [

      listVideosByChannel({ channel }),

      models.LiveapiVideo.findAll({ where: { channel }}),
    ]

    if (show) {

      promises.push( models.ShowEpisode.findAll({ where: { show_id: show.id }}) )

    } else {

      promises.push([])

    }

    const [videos, liveapiVideos, episodes] = await Promise.all(promises)


    return { videos, liveapiVideos, episodes }

  } catch(error) {

    return badRequest(error)

  }

}

