'use strict'

class MensageriaController {

  constructor ({ socket, request, tjapauth }) {

    socket.tjapauth = tjapauth;

    this.socket  = socket
    this.request = request

    console.log('conectou: ' + socket.id + ' - ' + socket.topic);

  }

  onClose(socket) {

    console.log('desconectou: ' + socket.id + ' - ' + socket.topic);

  }

}

module.exports = MensageriaController
