"use strict";
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
  async handle(ctx, next) {
    const { request } = ctx;

    // const auth = await this.usuario(request);
    // if (auth) {
    //   ctx.tjapauth = auth;
    // }

    await next();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle(ctx, next) {
    const { request } = ctx;

    // const auth = await this.usuario(request);
    // if (auth) {
    //   ctx.tjapauth = auth;
    // }

    await next();
  }

  getToken(request) {
    let token = request.header("Auth-Token");

    if (token) {
      return token;
    }

    const params = request.all();

    if (params && params.AuthToken) {
      return params.AuthToken;
    }

    return null;
  }

  async usuario(request) {
    const token = this.getToken(request);

    if (!token) {
      return null;
    }

    const resposta = await axios.post("/publico/restaurar-sessao", {
      token
    });

    if (!(resposta && resposta.data && resposta.data.dados)) {
      return null;
    }

    return resposta.data.dados;
  }
}

module.exports = TjapAuth;
