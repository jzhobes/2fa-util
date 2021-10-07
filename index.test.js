const {authenticator} = require('otplib');
const {generateSecret, verify} = require('./index');

describe('2fa-util', () => {
  describe('generateSecret', () => {
    it('only accepts non-empty string label input values', async () => {
      for (const label of ['', ' ', 1, {}, new Map(), new Set(), new Date(), Infinity, NaN, undefined, null, new RegExp()]) {
        await expect(generateSecret(label)).rejects.toThrow('Invalid label.');
      }
    });

    it('only accepts non-empty string issuer input values if provided', async () => {
      for (const issuer of [1, {}, new Map(), new Set(), new Date(), Infinity, new RegExp()]) {
        await expect(generateSecret('foobar', issuer)).rejects.toThrow('Invalid issuer.');
      }
    });

    it('does not specify the issuer in the otpauth url if not provided', async () => {
      const asdf = await generateSecret('John Doe', 'Company');
      const {otpauth} = await generateSecret('foobar');
      expect(otpauth).toMatch(/otpauth:\/\/totp\/foobar:foobar\?secret=(.+)&period=30&digits=6&algorithm=SHA1/);
    });

    it('trims the provided label and issuer values in the otpauth', async () => {
      const {otpauth} = await generateSecret('  bar  ', '  foo  ');
      expect(otpauth).toMatch(/otpauth:\/\/totp\/foo:bar\?secret=(.+)&period=30&digits=6&algorithm=SHA1&issuer=foo/);
    });

    it('returns the QR code as an encoded base64 data uri string', async () => {
      const {qrcode} = await generateSecret('bar', 'foo');
      expect(qrcode).toMatch(/data:image\/png;base64,.+/);
    });
  });

  describe('verify', () => {
    it('verifies to true on a valid token', async () => {
      const {secret} = await generateSecret('bar', 'foo');

      expect(verify(authenticator.generate(secret), secret)).toBe(true);
    });
  });
});
