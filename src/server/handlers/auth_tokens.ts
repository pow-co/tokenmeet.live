

import { generate } from '../../jwt';

import * as http from 'superagent'

const uuid = require('uuid-random')

async function getPowcoBalance(paymail) {

  return getTokenBalance({origin: '93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2', paymail})

}

async function getTokenBalance({origin, paymail}) {

    const { body: data } = await http.get(`https://staging-backend.relayx.com/api/token/${origin}/owners`)

    const [owner] = data.data.owners.filter((owner: any) => {
    
        return owner.paymail === paymail
    })

    return owner
}

async function authWallet({ paymail, token, wallet, tokenOrigin }: {paymail: string, token: string, wallet: string, tokenOrigin: string}): Promise<string> {

  /*var authorized = await relay.authenticate({
    paymail,
    token
  })*/

  tokenOrigin  = tokenOrigin || '93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2'

  const {amount} = await getTokenBalance({paymail, origin: tokenOrigin})

  if (amount< 1) throw new Error('Not enough funds')

  const name = `${paymail} - ${amount} pow.co`

  console.log({ name, amount })

    const jwt = generate({
        name,
        paymail,
        room: tokenOrigin,
        avatar: "https://relayx.io/images/relayx-logo.png",
    });

    return jwt

}

export async function create(req, h) {

  /*

    This is the handler for the /auth_tokens endpoint.

    It receives a POST request with a paymail and a token, and a room name and returns a JWT.
    
    Room names follow a number of patterns including token and paymail based rooms:

    - token-based: /meet/{origin}/{minimumAmount}
    - paymail-based: /meet/{paymail}
    - 1name-based: /meet/1{name}

    For paymail-based or 1name-based rooms the room will require the owner of the room to be present in the room.
    Before that moment the participants will be in a waiting room until the owner joins, at which point the recording
    will begin.
  */

  const { token, paymail, room1name, roomPaymail, roomMinimumAmount, tokenOrigin } = req.payload

  console.log("server.handlers.auth_tokens.create", { payload: req.payload })

  if (!req.payload.wallet) {

    return { error: "wallet parameter must be provided" }

  }
	/*
		Create an authentication jwt using relayx, phantomjs, or handcash
		Must validate signature for each of them, then generates a signed web token and returns it to the client
	*/
  try {

    let jwt = await authWallet(req.payload);

    return { jwt }

  } catch(error) {

    console.error(error)

    return { error: error.message }

  }

}
