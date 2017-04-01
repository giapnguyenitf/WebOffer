const crypto = require('./crypto');

module.exports = class Auth {
  constructor(secret) {
    if(typeof secret === 'undefined') secret = 'a secret key';
    this.secret = secret;
    this.auth = crypto.seed(40);
    this.key = crypto.createHmac(this.auth, this.secret);
  }

  create() {
    this.auth = crypto.seed(40);
    this.key = crypto.createHmac(this.auth, this.secret);
    return this.key;
  }

  authentication(key) {
    return this.key === key;
  }
};
