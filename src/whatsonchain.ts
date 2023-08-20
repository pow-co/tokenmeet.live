
import { bsv } from 'scrypt-ts'

import axios from 'axios'

import delay from './delay'

export async function fetchTransaction({ txid }): Promise<bsv.Transaction> {

  try {

    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)

    return new bsv.Transaction(data)
  

  } catch(error) {

    console.error(error)

  }

}

interface Unspent {

  height: number;
  tx_pos: number,
  tx_hash: string;
  value: number;
}

export async function listUnspent({ address }): Promise<{
  script: string;
  satoshis: number;
  txId: string;
  outputIndex: number;
}[]> {

  const { data } = await axios.post('https://api.whatsonchain.com/v1/bsv/main/addresses/unspent', {
    addresses: [address]
  })

  return Promise.all(data[0].unspent.map(async (unspent: Unspent) => {

    const { data: txData } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${unspent.tx_hash}`)

    const scriptPubKey = txData.vout[unspent.tx_pos].scriptPubKey.hex

    return {

      script: scriptPubKey,

      satoshis: unspent.value,

      txId: unspent.tx_hash,

      outputIndex: unspent.tx_pos

    }

  }))

}

export async function getTransaction(txid: string): Promise<WhatsonchainTransaction> {

  let url =`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`

  let {data} = await axios.get(url)

  return data

}

export async function broadcastTransaction(tx: bsv.Transaction): Promise<void> {

  await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
    txhex: tx.toString()
  })

}

export async function getScriptHistory({ scriptHash }:{ scriptHash: string }): Promise<{tx_hash: string, height: number}[]> {
    
  let url = `https://api.whatsonchain.com/v1/bsv/main/script/${scriptHash}/history`
      
  const { data } = await axios.get(url)
    
  return data
    
}

export async function getSpend(args: GetSpend): Promise<{txid:string,vin:number} | null> {

  console.log('GET SPEND', args)

  const history = await getScriptHistory({ scriptHash: args.script_hash })

  console.log(history)

  await delay(500)

  const spends: any[] = [];

  for (let item of history.reverse()) {

    await delay(500)

    const { tx_hash } = item

    console.log(tx_hash, args.txid)

    if (tx_hash === args.txid) { return null }

    const transaction = await getTransaction(tx_hash)

    const matches = transaction.vin.map((vin, index) => {

      return Object.assign(vin, { index })

    }).filter((vin, index) => {

      return vin.txid == args.txid && vin.vout == args.vout

    })

    let match = matches[0]

    if (match) {

      spends.push({
        txid: tx_hash,
        vin: match.index 
      })

    };

  }

  const spend = spends.flat().filter(s => !!s)[0]

  return spend

}

interface GetSpend {
  script_hash: string;
  txid: string;
  vout: number;
} 


export interface WhatsonchainTransaction {
  txid: string;
  hash: string;
  time: number;
  blocktime: number;
  blockhash: string;
  vin: any[];
  vout: any[];
}
