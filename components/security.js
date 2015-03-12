'use strict';

var crypto = require('crypto');

exports = module.exports = {

  algorithm: 'aes-128-ctr',

  salt: process.env.SALT,
  
  encrypt: function(text) {
    var cipher = crypto.createCipher(this.algorithm, this.salt);
    var crypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
    console.log('CRYPTED ' + crypted);
    return encodeURIComponent(crypted);
  },

  decrypt: function(encrypted) {
    var text = decodeURIComponent(encrypted);
    var decipher = crypto.createDecipher(this.algorithm, this.salt);
    var decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
    return decrypted;
  }

};