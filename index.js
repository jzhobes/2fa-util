const {authenticator} = require('otplib');
const {toDataURL} = require('qrcode');

/**
 * Generates the base32 encoded hex secret key along with QR code as an encoded image URI.
 *
 * @param {string} label
 * @param {string} [issuer]
 * @return {Promise<{qrcode: string, secret: string, otpauth: string}>}
 */
async function generateSecret(label, issuer) {
  const trimmedLabel = label && typeof label === 'string' ? label.trim() : undefined;
  if (!trimmedLabel) {
    throw new Error('Invalid label.');
  }
  if (issuer && typeof issuer !== 'string') {
    throw new Error('Invalid issuer.');
  }

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(trimmedLabel, (issuer || '').trim(), secret);
  return {
    qrcode: (await toDataURL(otpauth)),
    otpauth,
    secret,
  };
}

/**
 * @param {string} token
 * @param {string} secret
 * @param {Object} [options]
 * @return {boolean}
 */
function verify(token, secret, options = {}) {
  if (options && typeof options !== 'object') {
    throw new Error('Invalid options.');
  }
  return authenticator.create({
    ...authenticator.allOptions(),
    ...options,
  }).verify({token, secret});
}

/**
 * Generates the 6-digit token.
 *
 * @param {string} secret
 * @return {string}
 */
function generate(secret) {
  return authenticator.generate(secret);
}

module.exports = {
  generateSecret,
  generate,
  verify,
};
