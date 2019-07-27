'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const axios = require("../../config/axios");

class TjapAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {

    const token = request.header("Auth-Token");

    if (!token) {
      return response.status(301).send("Informe o Token do Tucujuris!");
    }

    const resposta = await axios.post("/publico/restaurar-sessao", {
      token
    });

    if (!(resposta && resposta.data && resposta.data.dados)) {
      return response.status(500).send("Falha de Autenticação!");
    }

    request.tjapauth = resposta.data.dados;

    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = TjapAuth
