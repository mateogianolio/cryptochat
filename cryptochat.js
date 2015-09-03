#!/usr/bin/env node

(function() {
  'use strict';

  var DEBUG = false;

  var address = process.argv[2];
  if(!address) {
    console.log('Error: no IP address provided.');
    console.log('cryptochat <address> <encryption_key>');
    return;
  }

  var key = process.argv[3];
  if(!key) {
    console.log('Error: encryption key missing.');
    console.log('cryptochat <address> <encryption_key>');
    return;
  }

  var raw = require('raw-socket'),
      exec = require('exec-sync'),
      crypto = require('./encryption.js'),
      socket = raw.createSocket({
        protocol: raw.Protocol.ICMP
      });

  process.stdin.setEncoding('utf8');

  // bind events
  process.stdin.on('data', send);
  socket.on('message', listen);

  var message = '',
      id = 0x6363, // 'cc'
      count = 0,
      offset,
      type,
      length,
      hex;

  function listen(buffer, source) {
    // convert buffer to hex string
    buffer = buffer.toString('hex', 0, buffer.length);

    // find identifier in buffer or return
    offset = buffer.indexOf(id.toString(16));
    if(offset === -1)
      return;

    // get length of message (first 2 bytes after identifier)
    offset += 4;
    length = parseInt(buffer.substring(offset, offset + 4), 16);

    // get type of message
    type = parseInt(buffer.substring(40, 42), 16);

    // get message
    offset += 4;
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
    if(hex === 'ffffffffffffffff') {
      process.stdout.write(source + ' ');
      process.stdout.write('[' + count + ']: ');
      process.stdout.write(crypto.decrypt(message, key).split(/\r|\r\n/).shift());

      count = 0;
      message = '';
      
      return;
    }

    message += hex;
    count++;
  }

  function send(text) {
    var msg = crypto.encrypt(text, key),
        payloads = msg.match(/.{1,16}/g),
        payload;

    for(var i = 0; i < payloads.length; i++) {
      payload = payloads[i];
      payload = id.toString(16) + ('0000' + payload.length.toString(16)).substr(-4) + payload;
      while(payload.length < 16)
        payload += '0';

      exec('ping -s 48 -c 1 -p ' + payload + ' ' + address);
    }

    exec('ping -s 48 -c 1 -p 63630010ffffffffffffffff ' + address); // end ping
  }
}());
