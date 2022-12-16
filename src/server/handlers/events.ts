
import { badRequest }  from 'boom'
import { log } from '../../log'
import models = require('../../models')

export async function index(req, h) {

    try {

        const { eventType } = req.query

        const where = {}

        if (eventType) {

            where['payload'] = {
                eventType: {
                    $eq: eventType
                }
            }

        }

        const limit = req.query.limit || 100
        const offset = req.query.offset || 0

        const events = await models.Event.findAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        })

        return { events, where, limit, offset }

    } catch(error) {

        log.error('Error in events.index', error)

        return badRequest(error.message)
    }

}

export async function show(req, h) {

    try {

    } catch(error) {
        
        log.error('Error in events.show', error)

        return badRequest(error.message)
    }

}