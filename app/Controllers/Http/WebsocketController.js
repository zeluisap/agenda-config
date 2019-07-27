'use strict'

const Ws = use("Ws");

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

}

module.exports = WebsocketController
