(function() {
  'use strict';

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

    var raw = require('raw-socket'),
        crypto = require('./encryption.js'),
        socket = raw.createSocket({
          protocol: raw.Protocol.ICMP
        });

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', send);

    function send(msg) {
      var payloads = msg.match(/.{1,31}/g),
          payload,
          length,
          buffer;

      for(var i = 0; i < payloads.length; i++) {
        payload = payloads[i];
        length = ('00' + (payload.length * 2).toString(16)).substr(-2);
        payload = length + crypto.encrypt(payload, key);

        buffer = packet(payload);
        socket.send(buffer, 0, buffer.length, address, sent);

        sleep(100);
      }

      buffer = packet('1f');
      socket.send(buffer, 0, buffer.length, address, sent);
    }

    function packet(message) {
      while(message.length < 64)
        message += 'f';

      var buffer = new Buffer(40);
      buffer[0] = 0x08; // type
      buffer[1] = 0x00; // code
      buffer[2] = 0x00; // checksum placeholder
      buffer[3] = 0x00; // checksum placeholder
      buffer[4] = 0x00; // identifier
      buffer[5] = 0x01; // identifier
      buffer[6] = 0x0a; // seqnum
      buffer[7] = 0x09; // seqnum
      buffer.write(message, 8, 'hex');
      raw.writeChecksum(buffer, 2, raw.createChecksum(buffer));

      return buffer;
    }

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for(var i = 0; i < 1e7; i++)
        if((new Date().getTime() - start) > milliseconds)
          break;
    }

    function sent(error) {
      if(error)
        throw error;
    }
  };
}());
