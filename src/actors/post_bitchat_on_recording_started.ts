
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'post_bitchat_on_recording_started'

export const routingkey = 'jaas.8x8.vc.webhook'

import * as models from '../models'
import { broadcastTransaction, listUnspent } from '../whatsonchain'
import axios from 'axios'
import bops from 'bops'
import { bsv } from 'scrypt-ts'

export default async function start(channel, msg, json) {

  log.debug('rabbi.actor.notify_bitchat_on_recording_started', {
    message: msg.content.toString(),
    json
  })

  switch(json.eventType) {

    case 'RECORDING_STARTED':

        notifyBitchat(json)

        break;

    default:

        break;

  }

}


async function notifyBitchat(json: any) {

  console.log("RECORDING_ENDED", json)

    const address = new bsv.PrivateKey(process.env.PRIVATE_KEY).toAddress().toString()

    console.log('listing unspent', { address })

    const unspent = await listUnspent({ address })

    console.log({ unspent })

    const channel = json.data.conference.split('@')[0]

    const script: bsv.Script = buildMessageScript({
      content: `A New Recording Was Started At https://pow.co/meet/${channel}`,
      channel
    })

    console.log({ script })

    console.log(script.toASM())

    const tx = new bsv.Transaction()

    tx.from(unspent)

    tx.addOutput(new bsv.Transaction.Output({
      script,
      satoshis: 1
    }))

    tx.change(address)

    tx.sign(new bsv.PrivateKey(process.env.PRIVATE_KEY))

    console.log(tx.toString())

    console.log(tx.hash)

    await broadcastTransaction(tx)

    console.log('broadcasted transaction')

    axios.get(`https://pow.co/api/v1/chat/messages/${tx.hash}`).catch(console.error);
  
    axios.get(`https://pow.co/api/v1/content/${tx.hash}`).catch(console.error);

}

const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;


  function buildMessageScript({ content, channel }: { content: string, channel: string }): bsv.Script {

    let dataPayload = [
      B_PREFIX, // B Prefix
      content,
      "text/plain",
      "utf-8",
      "|",
      MAP_PREFIX, // MAP Prefix
      "SET",
      "app",
      'pow.co',
      "type",
      "message",
      "paymail",
      'gwen.ives@pow.co',
      "context",
      "channel",
      "channel",
      channel
    ];

    const script = bsv.Script.fromASM(
      "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
    );

    return script

  }