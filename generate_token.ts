/**
 * Generate a new JWT.
 */

require('dotenv').config();

import { readFileSync } from 'fs';
import { generate } from './src/jwt';

const uuid = require('uuid-random')

const privateKey = readFileSync(process.env.jaas_8x8_private_key_path || './private.key', 'utf8')

const token = generate(privateKey, {
    id: uuid(),
    balance: 5,
    name: "owenkellogg@relayx.io",
    email: "owenkellogg@relayx.io",
    avatar: "https://relayx.io/images/relayx-logo.png",
    appId: process.env.jaas_8x8_app_id, // Your AppID ( previously tenant )
    kid: process.env.jaas_8x8_api_key_id // Your API Key ID
});

console.log(token);