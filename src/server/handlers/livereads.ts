
import { badRequest, notFound } from 'boom'

import { Op } from 'sequelize'

import * as models from '../../models'

import { Transaction } from 'bsv'

import { Liveread } from 'liveread'

export async function createByTxhex(req, h) {

  try {

    const { txhex } = req.payload

    console.log({ txhex })

    const tx = new Transaction(txhex)

    console.log(tx)

    const livereads = []

    for (let index=0; index < tx.outputs.length; index++) {

      try {

        console.log({ index })

        var contract = Liveread.fromTx(tx, index)

        console.log({ contract })
      } catch(error) {

      }

      try {

        if (!contract) {

          const script = tx.outputs[index].script.toHex()

          console.log({ script })

          contract = Liveread.fromLockingScript(script) 
        }

        if (contract) {

          const [record, isNew] = await models.Liveread.findOrCreate({
            where: {
              txid: tx.hash,
              txix: index
            },
            defaults: {
              txid: tx.hash,
              txix: index,
              commentary: contract.commentary,
              sponsor: contract.sponsor,
              host: contract.host
            }
          })

          if (record) {

            livereads.push(record.toJSON())

          }

        }

      } catch(error) {

        console.log('cant find')

      }

    }

    return { livereads }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function index(req, h) {

  try {

    const where = {}

    if (req.query.host) {
      where['host'] = req.query.host
    }

    if (req.query.sponsor) {
      where['sponsor'] = req.query.sponsor
    }

    if (req.query.spent) {
      where['spent_txid'] = {
        [Op.ne]: null
      }
    }

    if (req.query.spent_method) {
      where['spent_method'] = req.query.spent_method
    }

    if (req.query.spent_txid) {
      where['spent_txid'] = req.query.spent_txid
    }

    if (req.query.spent_txix) {
      where['spent_txix'] = req.query.spent_txix
    }

    const limit = req.query.limit || 100

    const offset = req.query.offset || 0

    const order = ['createdAt', req.query.order || 'desc']

    const livereads = await models.Liveread.findAll({
      where,
      limit,
      offset,
      order
    })

    return { livereads }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function show(req, h) {

  const [txid, txix] = req.params.txid.split('_')

  try {

    const where = { txid }

    if (txid) { where['txix'] = txid }

    const liveread = await models.Liveread.findOne({
      where 
    })

    if (!liveread) {

      return notFound()
    }

    return { liveread }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

