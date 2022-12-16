
import { badRequest }  from 'boom'
import { log } from '../../log'

export async function index(req, h) {

    try {

    } catch(error) {

        log.error('Error in recordings.index', error)

        return badRequest(error.message)
    }

}

export async function show(req, h) {

    try {

    } catch(error) {
        
        log.error('Error in recordings.show', error)

        return badRequest(error.message)
    }

}