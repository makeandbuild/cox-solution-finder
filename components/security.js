'use strict';

exports = module.exports = {

  crypto: require('crypto'),

  algorithm: 'aes-256-ctr',

  salt: process.env.SALT,
  

  encrypt: function(text) {
    var cipher = this.crypto.createCipher(this.algorithm, this.salt);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  decrypt: function(text) {
    var decipher = this.crypto.createDecipher(this.algorithm, this.salt)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

};