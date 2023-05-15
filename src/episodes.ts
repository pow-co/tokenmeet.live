
import * as models from './models'

import { findOrCreateLivestream } from './liveapi'

export async function createEpisode({ channel, title, date, token_origin }: {
  channel: string,
  title: string,
  date: string,
  token_origin?: string
}) {

  const show = await models.Show.findOne({
    where: { stub: channel },
    defaults: { stub: channel }
  })

  if (!show) {

    throw new Error(`show ${channel} not found`)

  }

  const livestream = await findOrCreateLivestream({ channel }) 

  console.log('livestream', livestream)

  const episode = await models.ShowEpisode.create({
    show_id: show.id,
    hls_live_url: livestream.playback.hls_url,
    title,
    date,
    token_origin
  })

  return episode

}

