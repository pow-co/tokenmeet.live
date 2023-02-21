
var jsonwebtoken = require('jsonwebtoken');
require('dotenv').config()

import * as moment from 'moment'

/**
 * Function generates a JaaS JWT.
 */


import { readFileSync } from 'fs'

const privateKey = readFileSync(process.env.jaas_8x8_private_key_path || './private.key', 'utf8')

export interface GenerateJWTOptions {
  room: string;
  paymail: string,
  name?: string,
  avatar?: string
}
export const generate = ({ name, paymail, avatar, room }: GenerateJWTOptions) => {

  const appId = process.env.jaas_8x8_app_id // Your AppID ( previously tenant )

  const kid = process.env.jaas_8x8_api_key_id // Your API Key ID

  const id = paymail

  const email = paymail

  name = name || paymail

  avatar = avatar || `https://a.relayx.com/u/${paymail}`

  const now = new Date()

  const payload = {
    aud: 'jitsi',
    context: {
      user: {
        id: 1,
        name,
        avatar,
        email,
        moderator: true
      },
      features: {
        livestreaming: true,
        recording: true,
        transcription: true,
        "outbound-call": false
      }
    },
    iss: 'chat',
    room: `${process.env.jaas_8x8_app_id}/${room}`,
    sub: appId,
    exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
    nbf: (Math.round((new Date).getTime() / 1000) - 10)
  }

  const exp = moment().add(3, 'hours').unix()

  const nbf = moment().subtract(1, 'day').unix()

  const iat = moment().unix()

  const newPayload = {
    "aud": "jitsi",
    "iss": "chat",
    "iat": iat,
    "exp": exp,
    "nbf": nbf,
    "sub": "vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf",
    "context": {
      "features": {
        "livestreaming": true,
        "outbound-call": true,
        "sip-outbound-call": false,
        "transcription": true,
        "recording": true
      },
      "user": {
        "hidden-from-recorder": false,
        "moderator": true,
        "name": name,
        "id": `paymail|${email}`,
        "avatar": avatar,
        "email": email
      }
    },
    "room": "*"
  }

  console.log('jwt.sign.payload', newPayload)


  const jwt = jsonwebtoken.sign(newPayload, privateKey, { algorithm: 'RS256', header: { kid } })

  return jwt;
}

