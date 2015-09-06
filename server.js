(function() {
  module.exports = function(key) {
    require('terminal-colors');

    var DEBUG = false;
    var raw = require('raw-socket'),
        crypto = require('./encryption.js'),
        socket = raw.createSocket({
          protocol: raw.Protocol.ICMP
        });

    var message = '',
        id = 0x6363, // 'cc'
        count = 0,
        offset,
        type,
        length,
        hex;

    socket.on('message', listen);
    function listen(buffer, source) {
      // convert buffer to hex string
      buffer = buffer.toString('hex');

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
