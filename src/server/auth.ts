import { getPublicKey, isValidSignature } from '../paymail'

export async function authRelay(request, user, token) {

  // username corresponds to paymail address
  // password corresponds to signed token

  let { paymail, publickey } = await getPublicKey(user)

  console.log('getpubkey', { paymail, publickey })

  request.paymail = paymail

  let [message, signature] = token.split('.')

  let validSignature = await isValidSignature(message, signature, publickey)

  if (!validSignature) {
    return { isValid: false }
  }

  return {
    isValid: true,
    credentials: {
      paymail
    }
  }

}

export function attachStategies(server) {

  server.auth.strategy("relay", "basic", {

    validate: authRelay

  });
}
