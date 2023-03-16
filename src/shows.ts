
import * as models from './models'

export class Show {

  record: any;

  constructor({ record }) {

    this.record = record
  }

}

interface CreateShow {
  name: string;
  stub: string;
}

export async function create(params: CreateShow): Promise<Show> {

  const [record] = await models.Show.findOrCreate({
    where: {
      stub: params.stub
    },
    defaults: params
  })

  return new Show({ record })
}

export async function findOne({ stub }: {stub: string}): Promise<Show | null> {

  const record = await models.Show.findOne({
    where: {
      stub
    }
  })

  if (!record) {
    return null
  }

  return new Show({ record })
}

