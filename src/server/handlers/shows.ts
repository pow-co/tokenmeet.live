
import { notFound } from 'boom'

import * as models from '../../models'

export async function index(req, h) {

  const shows = await models.Show.findAll()

  return { shows }

}

export async function show(req, h) {

  console.log("STUB", req.params.stub)

  const show = await models.Show.findOne({
    where: {
      stub: req.params.stub
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

