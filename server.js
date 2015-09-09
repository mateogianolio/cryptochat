(function() {
  'use strict';

  module.exports = function(key) {
    require('terminal-colors');

    var DEBUG = true;
    var raw = require('raw-socket'),
        crypto = require('./encryption.js'),
        socket = raw.createSocket({
          protocol: raw.Protocol.ICMP
        });

    var message = '',
        count = 0,
        salt,
        iv,
        derivedKey,
        offset,
        type,
        length,
        hex;

    socket.on('message', listen);
    function listen(buffer, source) {
      // convert buffer to hex string, ignore IP header (20 bytes)
      buffer = buffer.toString('hex', 20, buffer.length);

      /**
       * types
       * 0x00 = ICMP Echo reply,
       * 0x08 = ICMP Echo request
       **/
      type = parseInt(buffer.substring(0, 2), 16);
      length = parseInt(buffer.substring(16, 18), 16);

      // get message
      offset = 18;
      hex = buffer.substring(offset, offset + length);

      if(DEBUG) {
        console.log('\nping #' + count);
        console.log('buffer:', buffer);
        console.log('type:', type === 0 ? 'ICMP Echo reply' : 'ICMP Echo request');
        console.log('message length:', length);
        console.log('message content:', hex);
      }

      // ignore ICMP Echo replies
      if(type === 0)
        return;

      // first ping
      if(!salt && !iv && length === 62) {
        salt = crypto.hex2bytes(hex.substring(0, 30));
        iv = crypto.hex2bytes(hex.substring(30, 62));
        count++;
        return;
      }

      // encountered end ping
      if((hex.match(/f/g) || []).length === length) {
        process.stdout.write(source.green + ' ');
        process.stdout.write('[' + count + ']: ');
        process.stdout.write(message.bold + '\n');

        count = 0;
        message = '';

        return;
      }

      derivedKey = crypto.key(key, salt);
      message += crypto.decrypt(hex, derivedKey, iv);
      crypto.hex2bytes(count++);
    }
  };
}());
