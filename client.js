(function() {
  module.exports = function(address, key) {
    if(!address) {
      console.log('Error: no IP address provided.');
      console.log('cryptochat <address> <encryption_key>');
      return;
    }

    if(!key) {
      console.log('Error: encryption key missing.');
      console.log('cryptochat <address> <encryption_key>');
      return;
    }

    var exec = require('exec-sync'),
        crypto = require('./encryption.js');

    var id = 0x6363; // 'cc'

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', send);

    function send(msg) {
      var payloads = msg.match(/.{1,8}/g),
          payload;

      for(var i = 0; i < payloads.length; i++) {
        payload = payloads[i];
        payload = id.toString(16) +
                  ('0000' + (payload.length * 2).toString(16)).substr(-4) +
                  crypto.encrypt(payload, key);

        while(payload.length < 16)
          payload += '0';

        exec('ping -s 48 -c 1 -p ' + payload + ' ' + address);
      }

      exec('ping -s 48 -c 1 -p 63630010ffffffffffffffff ' + address); // end ping
    }
  };
}());
