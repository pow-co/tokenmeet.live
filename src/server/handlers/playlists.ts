
import models = require('../../models')

export async function show(req, h) {

    const { playlist_id } = req.params

    const videos = await models.Video.findAll({
        where: {
            playlist_id
        }
    })

    return h.response({
        playlist: {
            playlist_id,
            videos
        }
     }).code(200)

}
