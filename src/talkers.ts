const query = `SELECT *, payload->'event'->>'muted' as muted FROM public.jaas_8x8_vc_events where namespace = 'jitsi-events' and payload->'user'->>'paymail' = 'elliswyatt@relayx.io' and type = 'audioMuteStatusChanged' order by "createdAt" desc;`

import * as models from './models'

export async function listAudioMutStatusChanged({paymail}: {paymail: string}) {

  return listJistiEvents({ paymail, type: 'audioMuteStatusChanged' })

}

export async function listJistiEvents(
  {paymail, type, start, end, limit, offset, order}:
  {paymail: string, type?: string, start?: Date, end?: Date, limit?: number, offset?: number, order?: string}) {

  const where = {
    namespace: 'jitsi-events',
    payload: {
      user: {
        paymail
      }
    }
  }

  if (type) {
    where['type'] = type
  }

  if (start) {
    where['createdAt'] = {
      $gte: start
    }
  }

  if (end) {
    where['createdAt'] = {
      $lte: end
    }
  }

  const results = await models.Event.findAll({
    where,
    limit: limit || 100,
    offset: offset || 0,
    order: ['createdAt',  order || 'DESC']
  })

  return results

}

async function listTimeSpoken({ start, end, paymail}: {start: Date, end: Date, paymail: string}): Promise<any> {

  const events = await listJistiEvents({ paymail, type: 'audioMuteStatusChanged', start, end, order: 'ASC' })

}
