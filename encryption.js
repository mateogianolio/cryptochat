(function() {
  'use strict';

  var ENCRYPTION = 'AES-256-CTR';
  
  var crypto = require('crypto');

  module.exports.encrypt = function(str, key) {
    var cipher = crypto.createCipher(ENCRYPTION, key),
        encrypted = cipher.update(str, 'utf8', 'hex');

    encrypted += cipher.final('hex');
    return encrypted;
  };

  module.exports.decrypt = function(str, key) {
    var decipher = crypto.createCipher(ENCRYPTION, key),
        decrypted = decipher.update(str, 'hex', 'utf8');

    decrypted += decipher.final('utf8');
    return decrypted;
  };
}());
