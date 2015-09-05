#!/usr/bin/env node

(function() {
  'use strict';

  var args = process.argv;

  args.shift(); // ignore 'node'
  args.shift(); // ignore path

  var ip,
      key;

  var type = args.shift();
  if(type === 'server') {
    key = args.pop();
    require('./server.js')(key);
  } else if(type === 'client') {
    key = args.pop();
    ip = args.pop();
    require('./client.js')(ip, key);
  } else if(args.length === 1) {
    ip = type;
    key = args.pop();
    require('./server.js')(key);
    require('./client.js')(ip, key);
  } else {
    console.log('Error: invalid format.\n');
    console.log('cryptochat <ip> <encryption_key>\t# send and receive messages');
    console.log('cryptochat server <encryption_key>\t# receive messages');
    console.log('cryptochat client <ip> <encryption_key>\t# send messages\n');
    process.exit();
  }
}());
