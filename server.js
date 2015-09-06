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
        offset,
        type,
        length,
        hex;

    socket.on('message', listen);
    function listen(buffer, source) {
      // convert buffer to hex string
      buffer = buffer.toString('hex', 20, buffer.length);
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

      // return if type is ICMP Echo reply
      if(type === 0)
        return;

      // end ping
      if(hex === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
        process.stdout.write(source.green + ' ');
        process.stdout.write('[' + count + ']: ');
        process.stdout.write(message.bold + '\n');

        count = 0;
        message = '';

        return;
      }

      message += crypto.decrypt(hex, key);
      count++;
    }
  };
}());
