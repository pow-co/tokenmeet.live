
import * as models from './models'

export class Show {

  record: any;

  constructor({ record }) {

    this.record = record
  }

}

interface CreateShow {
  name: string;
  channel: string;
}

export async function create(params: CreateShow): Promise<Show> {

  const [record] = await models.Show.findOrCreate({
    where: {
      channel: params.channel
    },
    defaults: params
  })

  return new Show({ record })
}

export async function findOne({ channel }: {channel: string}): Promise<Show | null> {

  const record = await models.Show.findOne({
    where: {
      channel
    }
  })

  if (!record) {
    return null
  }

  return new Show({ record })
}

