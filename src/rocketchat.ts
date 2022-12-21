require('dotenv').config()

import { Actor, log } from 'rabbi'

import config from './config'

const http = require("superagent");

const base = 'https://chat.21e8.tech/hooks';

const channels = {
  'misc': 'WPGC3DJvZSqR8xTcr/e5oBJAenhYsEijBpv8P3sKupdADLsAwzNk26TbT3nE2cDJmg',
  'powco-development': config.get('rocketchat_channel_powco_development')
}

export function notify(channel, message: string) {

  if (!channels[channel]) {
    log.error(`rocketchat channel ${channel} not found`);
    channel = 'misc';
  }

  log.debug(`notify rocketchat ${message}`);

  http
    .post(`${base}/${channels[channel]}`)
    .send({
      text: message
    })
    .end((error, response) => {
      if (error) {
        log.error("rocketchat.error", error.message);
      } else {
        log.info("rocketchat.notified", response.body);
      }
    });
}

export async function notifyRocketChat(message: string): Promise<void> {

  return notify('misc', message)

}

