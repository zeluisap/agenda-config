"use strict";

const Database   = use('Database')
const Connection = use("App/Models/Connection");

class MensageriaController {
  constructor(ctx) {
    const { socket, request, tjapauth } = ctx;

    socket.tjapauth = tjapauth;

    this.socket = socket;
    this.request = request;

    this.add(ctx);

    console.log(
      "conectou: " +
        socket.id +
        " - " +
        socket.topic +
        (tjapauth && tjapauth.token
          ? ` - ${tjapauth.token} - ${tjapauth.pessoa.nome}`
          : "")
    );
  }

  async add(ctx) {
    const { socket, request, tjapauth } = ctx;

//    const trx = await Database.beginTransaction();

    try {
      const conn = new Connection();

      conn.ws_id = socket.id;
      conn.topic = socket.topic;

      if (tjapauth) {
        conn.token = tjapauth.token;
        if (tjapauth.pessoa && tjapauth.pessoa.nome) {
          conn.nome = tjapauth.pessoa.nome;
        }
        if (tjapauth.especialidade && tjapauth.especialidade.tipo_especialidade) {
          conn.tipo_especialidade = tjapauth.especialidade.tipo_especialidade;
        }
      }

      await conn.save();

      // trx.commit();

    } catch (error) {
      console.error({
        error
      });
      // trx.rollback();
    }
  }

  async onClose(socket) {
    try {

      await Connection.query()
        .where("ws_id", "=", socket.id)
        .delete();

      // const trx = await Database.beginTransaction();

      // trx.commit();

      console.log("desconectou: " + socket.id + " - " + socket.topic);
    } catch (error) {
      console.error(error);
      // trx.rollBack();
    }
  }
}

module.exports = MensageriaController;
