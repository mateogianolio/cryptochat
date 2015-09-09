(function() {
  'use strict';

  var ENCRYPTION = 'AES-256-CTR';

  var crypto = require('crypto');

  module.exports = {
    encrypt: function(str, key, iv) {
      var cipher = crypto.createCipheriv(ENCRYPTION, key, iv),
          encrypted = cipher.update(str, 'utf8', 'hex');

      encrypted += cipher.final('hex');
      return encrypted;
    },
    decrypt: function(str, key, iv) {
      var decipher = crypto.createDecipheriv(ENCRYPTION, key, iv),
          decrypted = decipher.update(str, 'hex', 'utf8');

      decrypted += decipher.final('utf8');
      return decrypted;
    },
    salt: function() {
      return crypto.randomBytes(16);
    },
    iv: function() {
      return crypto.randomBytes(16);
    },
    key: function(secret, salt) {
      return crypto.pbkdf2Sync(secret, salt, 4096, 32);
    },
    hex2bytes: function(hex) {
      if(hex % 2 !== 0)
        throw new Error(hex + ' is not a valid hex string');

      var bytes = new Buffer(hex.length / 2);
      for(var i = 0; i < hex.length; i += 2)
        bytes[i / 2] = parseInt(hex.substring(i, i + 1), 16);

      return bytes;
    }
  };
}());
