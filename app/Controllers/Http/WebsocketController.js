'use strict'

const Ws = use("Ws");

const Connection = use("App/Models/Connection");

class WebsocketController {

  async websocket({ request, response }) {
    try {

      const { channel, evento, dados } = request.all();

      if (!channel) {
        return response.status(301).send("Falha ao Chamar Websocket!");
      }

      const topic = Ws.getChannel(`*`).topic(channel);

      if (!topic) {
        return response.status(200).send({
          status: "ok"
        });
      }

      topic.broadcast(evento, dados);

      return response.status(200).send({
        status: "ok"
      });

    } catch (error) {
      return response.status(error.status).send(error.message);
    }
  }

  async report({ request, response }) {

    const retorno = {
      todos: 0,
      visitantes: 0,
      usuarios: 0,
      especialidades: []
    };

    retorno.todos = (await Connection
      .query()
      .where('topic', '=', 'todos')
      .count('id as quantidade')
      .first()).quantidade;

    retorno.visitantes = (await Connection
      .query()
      .where('topic', '=', 'visitante')
      .count('id as quantidade')
      .first())
      .quantidade;

    retorno.usuarios = (await Connection
      .query()
      .where('topic', '=', 'usuario')
      .count('id as quantidade')
      .first())
      .quantidade;

    const esps = (await Connection
      .query()
      .select('topic', 'tipo_especialidade')
      .where('topic', 'like', 'especialidade:%')
      .groupBy('topic', 'tipo_especialidade')
      .count('* as quantidade'));

    retorno.especialidades = esps;

    return retorno;

  }

}

module.exports = WebsocketController
