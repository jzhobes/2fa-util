# 2fa-util

![Build Status](https://github.com/jzhobes/2fa-util/actions/workflows/nodejs.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![NPM Version](https://img.shields.io/npm/v/2fa-util.svg)

A lightweight, robust Node.js utility for generating Two-Factor Authentication (TOTP) secrets, QR codes, and verifying tokens. Compatible with Google Authenticator, Microsoft Authenticator, and Authy.

### [🚀 Live Demo](https://jzhobes.github.io/2fa-util/)

## Features

*   **Easy Setup**: Generate a secret and QR code in one function call.
*   **Standard Compatible**: Works with any RFC 6238 compliant authenticator app.
*   **Flexible Verification**: Supports custom windows, steps, and other `otplib` options.
*   **Zero-Dependency (Runtime)**: Bundles necessary logic efficiently (uses `otplib` and `qrcode` under the hood).

## Installation

```bash
npm install 2fa-util
```

## Usage

### Basic Example

```javascript
const { generateSecret, verify } = require('2fa-util');

(async () => {
    // 1. Generate a Secret and QR Code
    const { secret, qrcode, otpauth } = await generateSecret('john.doe@example.com', 'MyApp');
    
    console.log('Secret:', secret);
    console.log('QR Code Data URL:', qrcode); // Display this in an <img src="...">

    // ... User scans QR code ...

    // 2. Verify a Token
    const userToken = '123456'; // Input from user
    const isValid = verify(userToken, secret);

    console.log('Is Valid:', isValid);
})();
```

### Advanced Verification (Custom Options)

You can pass standard `otplib` options to the `verify` function, such as `window` (for clock drift) or `step`.

```javascript
const isValid = verify(token, secret, {
    window: 1, // Allow 1 step before/after (approx +/- 30sec)
    step: 60   // Custom step size in seconds
});
```

## API Reference

### `generateSecret(label, [issuer])`

Generates a new TOTP secret and corresponding QR code.

*   **label** `(string)`: The username or account identifier (e.g., email).
*   **issuer** `(string, optional)`: The name of your application or company.
*   **Returns**: `Promise<Object>`
    *   `secret`: The base32 encoded secret key.
    *   `qrcode`: A Data URI string (base64) of the QR code image.
    *   `otpauth`: The raw `otpauth://` URL.

### `verify(token, secret, [options])`

Verifies a TOTP token against a secret.

*   **token** `(string)`: The 6-digit token provided by the user.
*   **secret** `(string)`: The user's stored secret key.
*   **options** `(Object, optional)`: Configuration object passed to `otplib`.
*   **Returns**: `boolean` (`true` if valid, `false` otherwise).

### `generate(secret)`

Generates the current token for a given secret (useful for testing or dev tools).

*   **secret** `(string)`: The secret key.
*   **Returns**: `string` (The current 6-digit token).

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/jzhobes/2fa-util.git
cd 2fa-util
npm install
```

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

## License

MIT © [John Ho](https://github.com/jzhobes)
