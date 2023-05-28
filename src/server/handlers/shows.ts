
import { notFound } from 'boom'

import * as models from '../../models'

export async function index(req, h) {

  const shows = await models.Show.findAll()

  return { shows }

}

export async function show(req, h) {

  const show = await models.Show.findOne({
    where: {
      channel: req.params.channel
    },
    includes: [{
      model: models.ShowEpisode,
      as: 'episodes',
      required: false
    }]
  })

  const episodes = await models.ShowEpisode.findAll({
    where:{ show_id: show.id }
  })

  if (!show) {

    return notFound()

  }

  return { show, episodes }

}

