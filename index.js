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
 * @return {boolean}
 */
function verify(token, secret) {
  return authenticator.verify({token, secret});
}

module.exports = {
  generateSecret,
  verify,
};
