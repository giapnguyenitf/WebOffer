const crypto = require('crypto');
const rnd = require('./MersenneTwister');

let _ = {
  isUndefined: function(variable) {
    return typeof variable === 'undefined';
  },
  isNumber: function(digit) {
    return typeof digit === 'number';
  }
};

let privateKey;

let chars = '0123456789abcdefghijklmnopqrstuvwxyz';

let deferred = function(callback, delay = 0) {
  if(_.isUndefined(delay)) delay = Math.floor(Math.random() * 10);
  return new Promise(function(r, rj){
    setTimeout(function(){
      callback();
      r();
    }, delay);
  });
}

let verify = function(seed) {
  if(_.isNumber(seed)) return seed;
  if(typeof seed !== 'string') return Math.floor(Math.random() * Math.pow(10, 6));
  let i = 0;
  let buf = Buffer.from(seed, 'utf8');
  let lucky = parseInt(buf.toString('utf8', i * 5, i * 5 +5), 16);
  while(lucky > Math.pow(10, 6))
  {
    i++;
    if(i * 5 + 5 > 64)
    {
      console.log('Wtf');
      lucky = Math.floor(Math.random() * Math.pow(10, 6));
      break;
    }

    lucky = parseInt(buf.toString('utf8', i * 5, i * 5 +5), 16);
  }

  return lucky;
}

let rand = function(limit, seed) {
  if(!_.isUndefined(seed)) seed = verify(seed);
  let r = new rnd(seed);
  let digit = r.random();
  if(_.isUndefined(limit)) return digit;
  return Math.floor(digit * limit);
}

let randUnit = function(len, seed) {
  if(!_.isUndefined(seed)) seed = verify(seed);
  let r = new rnd(seed);
  let digit = r.random();
  if(!_.isNumber(len)) return digit;
  return digit.toFixed(len).substring(2);
}

let charRand = function(len) {
  if(_.isUndefined(len) || !_.isNumber(len)) throw 'Error!';
  let buf = Buffer.allocUnsafe(len);
  for(let i = 0; i < len; i++)
    buf[i] = chars.charCodeAt(rand(36, Math.floor((Math.random() * Math.pow(10, 6)))));

  return buf.toString('utf8');
}

let key = function() {
  if(_.isUndefined(privateKey)) privateKey = charRand(256);
  return privateKey;
}

let encode = function(text, secret, code) {
  if(_.isUndefined(code)) code = 'aes256';
  if(_.isUndefined(secret)) secret = key();
  const cipher = crypto.createCipher(code, secret);
  let encode = cipher.update(text, 'utf8', 'hex');
  return encode + cipher.final('hex');
}

let decode = function(encode, secret, code) {
  if(_.isUndefined(code)) code = 'aes256';
  if(_.isUndefined(secret)) secret = key();
  const decipher = crypto.createDecipher(code, secret);
  let text = decipher.update(encode, 'hex', 'utf8');
  return text + decipher.final('utf8');
}

let createHash = function(text, code) {
  if(_.isUndefined(code)) code = 'sha256';
  const hash = crypto.createHash(code);

  hash.update(text);
  return hash.digest('hex');
}

let createHmac = function(text, secret, code) {
  if(_.isUndefined(code)) code = 'sha256';
  if(_.isUndefined(secret)) secret = key();
  const hmac = crypto.createHmac(code, secret);

  hmac.update(text);
  return hmac.digest('hex');
}

let roll = function (client_seed, server_seed, nonce) {
  let seed = createHmac(client_seed + '-' + nonce, server_seed);
  return randUnit(4, seed);
}

module.exports = {
  seed : function(len) {
    if(_.isUndefined(len)) len = 64;
    return charRand(len);
  },
  rand,
  roll,
  encode,
  decode,
  createHash,
  createHmac,
  deferred
};
