'use strict'

class SessaoVirtualController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request


    console.log(socket.topic)
  }
}

module.exports = SessaoVirtualController
