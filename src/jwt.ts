
var jsonwebtoken = require('jsonwebtoken');
require('dotenv').config()

/**
 * Function generates a JaaS JWT.
 */

export interface GenerateJWTOptions {
  id, name, email, avatar, appId, kid, balance, room
}
export const generate = (privateKey, { id, name, email, avatar, appId, kid, balance, room }: GenerateJWTOptions) => {

    const moderator = balance > 500

    console.log({ id, name, email, avatar, appId, kid })
  const now = new Date()
  const jwt = jsonwebtoken.sign({
    aud: 'jitsi',
    context: {
      user: {
        id,
        name,
        avatar,
        email: email,
        moderator
      },
      features: {
        livestreaming: moderator ? 'true' : 'false',
        recording: 'true',
        transcription: 'true',
        "outbound-call": 'false'
      }
    },
    iss: 'chat',
    room: `${process.env.jaas_8x8_app_id}/${room}`,
    sub: appId,
    exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
    nbf: (Math.round((new Date).getTime() / 1000) - 10)
  }, privateKey, { algorithm: 'RS256', header: { kid } })
  return jwt;
}
