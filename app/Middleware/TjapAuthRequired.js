"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class TjapAuthRequired {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, tjapauth }, next) {
    if (!tjapauth) {
      return response.status(301).send("Falha ao Autenticar!");
    }

    await next();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle({ request, tjapauth }, next) {
    if (!tjapauth) {
      throw new Error("Falha ao Autenticar!");
    }

    await next();
  }
}

module.exports = TjapAuthRequired;
