"use strict";

const ConfiguracaoService = use("App/Services/ConfiguracaoService");
const Util = use("App/Js/Util");

class ConfiguracaoController {
  async index(ctx) {
    return ConfiguracaoService.listar(ctx);
  }

  async show(ctx) {}

  async store(ctx) {
    const { request } = ctx;
    const fields = request.all();

    return ConfiguracaoService.salvar(fields);
  }

  async update(ctx) {}

  async destroy(ctx) {
    const { params } = ctx;
    const id = params.id;

    ConfiguracaoService.delete(id);
  }
}

module.exports = ConfiguracaoController;
