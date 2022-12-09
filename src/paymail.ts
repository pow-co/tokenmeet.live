import { PaymailClient } from '@moneybutton/paymail-client'
import fetch from 'isomorphic-fetch'
import * as dns from 'dns'
import * as bsv from 'bsv'

//const Message = require('bsv-message');

const client = new PaymailClient(dns, fetch)

interface PaymailPublicKey {
  paymail: string
  publickey: string
}

export async function getPublicKey(paymail: string): Promise<PaymailPublicKey> {

  const publickey = await client.getPublicKey(paymail)

  return {
    paymail,
    publickey
  }
}

export async function isValidSignature(message:string, signature: string, publickey: string): Promise<boolean> {


   return false //TODO: Replace Message, has been deprecated

  //return client.isValidSignature(new Message(message), signature, null, new bsv.PublicKey(publickey))

}
