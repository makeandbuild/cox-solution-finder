'use strict';

var crypto = require('crypto');

exports = module.exports = {

  algorithm: 'aes-128-ctr',

  salt: process.env.SALT,
  
  encrypt: function(text) {
    var cipher = crypto.createCipher(this.algorithm, this.salt);
    var crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    console.log('CRYPTED ' + crypted);
    return encodeURIComponent(crypted);
  },

  decrypt: function(encrypted) {
    var text = decodeURIComponent(encrypted);
    var decipher = crypto.createDecipher(this.algorithm, this.salt);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
  },

  md5hash: function(str) {
    var hash = crypto.createHash('md5');
    hash.update(str, 'utf8');
    
    return hash.digest('hex');
  }

};