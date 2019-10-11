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
  async handle({ request, response, tjap_auth }, next) {
    if (!tjap_auth) {
      return response.unauthorized("Falha ao Autenticar!");
    }

    await next();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle({ request, tjap_auth }, next) {
    if (!tjap_auth) {
      throw new Error("Falha ao Autenticar!");
    }

    await next();
  }
}

module.exports = TjapAuthRequired;
