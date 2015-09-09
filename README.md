# cryptochat

[![npm](https://img.shields.io/npm/dm/cryptochat.svg?style=flat-square)]()

[Encrypted](https://github.com/mateogianolio/cryptochat/blob/master/encryption.js) P2P chat over ICMP ([**I**nternet **C**ontrol **M**essage **P**rotocol](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol)).

I strongly advise you to pick a high-entropy encryption key to avoid the possibility of brute-force attacks.

Uses [raw-socket](http://npmjs.org/package/raw-socket) for ICMP handling and [terminal-colors](https://github.com/tinganho/terminal-colors) to spice it up a bit.

### Install and usage

Make sure you have node ```0.10.x``` (*tip:* use [n](https://www.npmjs.com/package/n)) and then install the package globally with ```sudo```.

```bash
sudo npm install -g cryptochat
```

Three variants of cryptochat are available depending on your use case:

* **Send** and **receive** messages
  ```bash
  $ sudo cryptochat <ip> <encryption_key>
  ```

* **Receive** messages
  ```bash
  $ sudo cryptochat server <encryption_key>
  ```

* **Send** messages
  ```bash
  $ sudo cryptochat client <ip> <encryption_key>
  ```

Because it relies on ```stdin``` for input, it is possible to use pipes to send data:

```bash
cat cryptochat.js | sudo cryptochat client <ip> <encryption_key>
```

### [ICMP Echo request](https://en.wikipedia.org/wiki/Ping_(networking_utility)) format

<table>
  <tr>
    <td><b>bits 0-7</b></td>
    <td><b>bits 8-15</b></td>
    <td><b>bits 16-31</b></td>
  </tr>
  <tr>
    <td>type = <code>0x08</code></td>
    <td>code = <code>0x00</code></td>
    <td>checksum</td>
  </tr>
  <tr>
    <td colspan="2">identifier</td>
    <td>sequence number</td>
  </tr>
  <tr>
    <td colspan="3">payload</td>
  </tr>
</table>

The message data is attached as the ICMP payload.

### Message
Messages are piped from ```stdin``` and split into payload packages, which are encrypted and sent as ICMP Echo requests. The payload size per request is currently set to 32 bytes. The first byte is the length of the message and the rest is the message itself.

The first request contains a salt and an initialization vector needed to decrypt the payloads.

<table>
  <tr>
    <td><b>byte 0</b></td>
    <td><b>bytes 1-15</b></td>
    <td><b>bytes 16-31</b></td>
  </tr>
  <tr>
    <td><code>0x3e</code></td>
    <td>salt</td>
    <td>initialization vector</td>
  </tr>
</table>

An "end" request is sent in order for the receiver to know when a message is completed. The end request has the following format:

<table>
  <tr>
    <td><b>byte 0</b></td>
    <td><b>bytes 1-31</b></td>
  </tr>
  <tr>
    <td><code>0x3e</code></td>
    <td><code>0xffffffff...</code></td>
  </tr>
</table>

When the end request is received, the full message is printed to the screen.

### Contribute

As always, contributions are much appreciated.
