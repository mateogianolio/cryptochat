# cryptochat

[![npm](https://img.shields.io/npm/dm/cryptochat.svg?style=flat-square)]()

Encrypted (see ```encryption.js```, currently uses the [crypto](https://nodejs.org/api/crypto.html) module's **AES-256-CTR**) P2P chat over ICMP using ```ping``` requests.

Uses the awesome [raw-socket](http://npmjs.org/package/raw-socket) for ICMP monitoring.

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

If it doesn't work, it is probably because either your computer or your router is somehow blocking external ICMP requests.

### [ICMP Echo request](https://en.wikipedia.org/wiki/Ping_(networking_utility)) format

<table>
  <tr>
    <td><b>bits 0-7</b></td>
    <td><b>bits 8-15</b></td>
    <td><b>bits 16-31</b></td>
  </tr>
  <tr>
    <td>type = ```0x0000```</td>
    <td>code = ```0x0000```</td>
    <td>header checksum</td>
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
Messages are piped from ```stdin``` and split into payload packages, which are encrypted separately and sent as ICMP Echo requests.

<table>
  <tr>
    <td><b>bits 0-15</b></td>
    <td><b>bits 16-31</b></td>
  </tr>
  <tr>
    <td>identifier = <code>0x6363</code></td>
    <td>message length</td>
  </tr>
  <tr>
    <td colspan="3">message</td>
  </tr>
</table>

An "end" request is sent in order for the receiver to know when a message is completed. The end request has the following format:

<table>
  <tr>
    <td><b>bits 0-15</b></td>
    <td><b>bits 16-31</b></td>
  </tr>
  <tr>
    <td>identifier = <code>0x6363</code></td>
    <td>message length = <code>0x0010</code></td>
  </tr>
  <tr>
    <td colspan="3"><code>0xffffffffffffffff</code></td>
  </tr>
</table>

When the end request is received, the full message is printed to the screen.

### Contribute

As always, contributions are much appreciated.
