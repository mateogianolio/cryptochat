# cryptochat

Encrypted (see ```encryption.js```, currently uses the [crypto](https://nodejs.org/api/crypto.html) module's **AES-256-CTR**) P2P chat over ICMP using ```ping``` requests.

```bash
$ sudo cryptochat <ip> <encryption_key>
```

If it doesn't work, it is probably because either your computer or your router is somehow blocking external ICMP requests.

### Install

Make sure you have node ```0.10.x``` (*tip:* use [n](https://www.npmjs.com/package/n)) and then install the package globally with ```sudo```.

```bash
sudo npm install -g cryptochat
```

### ICMP Echo request format

<table>
  <tr>
    <td>bits 0-7</td>
    <td>bits 8-15</td>
    <td>bits 16-31</td>
  </tr>
  <tr>
    <td>type = 0</td>
    <td>code = 0</td>
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
Messages are piped from ```stdin``` and encrypted before they are split into payload packages and sent as ICMP Echo requests.

<table>
  <tr>
    <td>bits 0-15</td>
    <td>bits 16-31</td>
  </tr>
  <tr>
    <td>identifier = 'cc'</td>
    <td>message length</td>
  </tr>
  <tr>
    <td colspan="3">message</td>
  </tr>
</table>

An "end" request is sent in order for the receiver to know when a message is completed. The end request has the following format:

<table>
  <tr>
    <td>bits 0-15</td>
    <td>bits 16-31</td>
  </tr>
  <tr>
    <td>0x6363</td>
    <td>0x0010</td>
  </tr>
  <tr>
    <td colspan="3">0xffffffffffffffff</td>
  </tr>
</table>

When the end request is received, the full message is decrypted and printed to the screen.

### Contribute

As always, contributions are much appreciated.
