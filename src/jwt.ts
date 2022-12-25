
var jsonwebtoken = require('jsonwebtoken');
var uuid = require('uuid-random');

/**
 * Function generates a JaaS JWT.
 */
export const generate = (privateKey, { id, name, email, avatar, appId, kid, balance }) => {

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
        transcription: 'false',
        "outbound-call": 'false'
      }
    },
    iss: 'chat',
    room: '*',
    sub: appId,
    exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
    nbf: (Math.round((new Date).getTime() / 1000) - 10)
  }, privateKey, { algorithm: 'RS256', header: { kid } })
  return jwt;
}
