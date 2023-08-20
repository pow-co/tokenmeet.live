
import { log } from 'rabbi'

export const exchange = 'powco'

export const queue = 'post_bitchat_on_recording_uploaded'

export const routingkey = 'jaas.8x8.vc.webhook'

import axios from 'axios'
import bops from "bops";

import { bsv } from 'scrypt-ts'
import { broadcastTransaction, listUnspent } from '../whatsonchain'

export default async function start(channel, msg, json: WebhookData) {

  log.debug('rabbi.actor.notify_bitchat_on_recording_uploaded', {
    message: msg.content.toString(),
    json
  })

  switch(json.eventType) {

    case 'RECORDING_UPLOADED':

        notifyBitchat(json)

        break;

    default:

        break;

  }

}

type WebhookData = {
  eventType: string;
  sessionId: string;
  timestamp: number;
  fqn: string;
  idempotencyKey: string;
  customerId: string;
  appId: string;
  data: {
    participants: any[];
    share: boolean;
    initiatorId: string;
    durationSec: number;
    startTimestamp: number;
    endTimestamp: number;
    recordingSessionId: string;
    preAuthenticatedLink: string;
  };
};

function getChannelFromFQN(fqn: string): string {
  const parts = fqn.split('/');
  return parts[parts.length - 1];
}

async function notifyBitchat(json: any) {

  console.log("RECORDING_ENDED", json)

    const address = new bsv.PrivateKey(process.env.PRIVATE_KEY).toAddress().toString()

    console.log('listing unspent', { address })

    const unspent = await listUnspent({ address })

    console.log({ unspent })

    const channel = getChannelFromFQN(json.fqn)

    const script: bsv.Script = buildMessageScript({
      content: `A New Recording Was Uploaded: ${json.data.preAuthenticatedLink}`,
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