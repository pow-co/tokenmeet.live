
import * as auth from '../../auth'

import * as relay from '../../relay'

import { readFileSync } from 'fs';
import { generate } from '../../jwt';
import axios from 'axios';

import * as http from 'superagent'

const uuid = require('uuid-random')

const privateKey = readFileSync(process.env.jaas_8x8_private_key_path || './private.key', 'utf8')

async function getPowcoBalance(paymail) {

    const { body: data } = await http.get('https://staging-backend.relayx.com/api/token/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2/owners')

    console.log('OWNERS', data.data.owners)

    const [owner] = data.data.owners.filter((owner: any) => {
    
        return owner.paymail === paymail
    })

    console.log('OWNER', owner)

    console.log('paymail', paymail)

    return owner
}

async function authWallet({ paymail, token, wallet }: {paymail: string, token: string, wallet: string}): Promise<string> {

  /*var authorized = await relay.authenticate({
    paymail,
    token
  })*/

  const {amount} = await getPowcoBalance(paymail)

  const name = `${paymail} - ${amount} pow.co`

  console.log({ name, amount })

    const jwt = generate(privateKey, {
        balance: amount,
        id: uuid(),
        name,
        email: paymail,
        avatar: "https://relayx.io/images/relayx-logo.png",
        appId: process.env.jaas_8x8_app_id, // Your AppID ( previously tenant )
        kid: process.env.jaas_8x8_api_key_id // Your API Key ID
    });

    return jwt

}

export async function create(req, h) {

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

    console.error(error.message)

    return { error: error.message }

  }

}
