const jwt = require('jsonwebtoken');
const passwordService = require('./password.crypto');

class JwtAuth {
    constructor() {

    }

    /**
     * 1. Encrypt the JSON of the user  (but encryption function only accepts String)
     *      - So parse JSON as string using JSON.stringify
     * 2. Generate Token using JWT.sign (key and expiry present in /config/token file)
     * 3. Again Encrpyt the token data :-p
     * 
     * Here we will encode the user-agent so the the token is valid for a particular user-agent only.
     * 
     * @param {Object} user
     * @param {String} userAgent
     */
    generateAccessToken(user) {
        return new Promise((resolve, reject) => {
            const encryptedUserData = passwordService.encrypt(JSON.stringify(user), process.env.CRYPTO_PASSWORD);

            if (encryptedUserData.error) {
                return reject(encryptedUserData.error);
            }

            jwt.sign(
                { signature: encryptedUserData.encoded },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY },
                (err, token) => {
                    if (err) reject(err);
                    else {
                        const encryptedToken = passwordService.encrypt(token, process.env.CRYPTO_PASSWORD);
                        if (encryptedToken.error) {
                            return reject(encryptedToken.error);
                        }
                        resolve(encryptedToken.encoded);
                    }
                }
            );
        });
    }

    /**
     * 1. Decrypt the encrypted token string of the user  (basically in authetication Middleware)
     * 2. Decode Token using JWT.verify (key present in /config/token file)
     * 3. Again Dencrpyt the decoded token data :-p
     *      - parse string as JSON using JSON.parse
     * Here we are also checking if the token is generated using the same user-agent from whic it is being accessed or not
     * 
     * @param {*} token
     * @param {*} header
     * @memberof JwtAuth
     */
    verify(token) {
        return new Promise((resolve, reject) => {
            const decryptedToken = passwordService.decrypt(token, process.env.CRYPTO_PASSWORD);

            if (decryptedToken.error) {
                return reject(decryptedToken.error);
            }
            token = decryptedToken.decoded;

            jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) reject(err);
                else {
                    if (decoded.signature) {
                        const decryptedSignature = passwordService.decrypt(decoded.signature, process.env.CRYPTO_PASSWORD);
                        if (decryptedSignature.error) {
                            return reject(decryptedSignature.error);
                        }
                        resolve(decryptedSignature.decoded);
                    } else {
                        reject({ name: 'AuthorizationError', message: `Invalid Token` });
                    }
                }
            });
        })
    }
}

module.exports = new JwtAuth;