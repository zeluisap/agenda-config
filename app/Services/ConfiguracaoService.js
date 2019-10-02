"use strict";

const Database = use("Database");
const Configuracao = use("App/Models/Configuracao");
const Util = use("App/Js/Util");

class ConfiguracaoService {
  static async listar(ctx) {
    const { request } = ctx;
    const { page, perPage } = Util.getPagination(ctx);

    let { order_key, order_reverse } = request.all();

    if (!order_key) {
      order_key = "id";
      order_reverse = "desc";
    }

    if (!order_reverse) {
      order_reverse = "asc";
    }

    return Configuracao.query()
      .where(function() {
        const { rota } = request.only(["rota"]);
        if (rota) {
          this.where("rota", "=", rota);
        }
      })
      .orderBy(order_key, order_reverse)
      .paginate(page, perPage);
  }

  static async getConfig(id) {
    return await Configuracao.find(parseInt(id));
  }

  static async salvar(fields) {
    let config = null;

    if (fields.id) {
      config = await Configuracao.find(fields.id);
    }

    if (!config) {
      config = new Configuracao();
    }

    config.fill(fields);

    const id = config.id ? config.id : 0;

    const quantidade = (await Configuracao.query()
      .where("rota", "=", config.rota)
      .where("id", "<>", id)
      .count()
      .first()).count;

    if (parseInt(quantidade)) {
      throw new Error("Falha! Rota já cadastrada!");
    }

    config.save();

    return config;
  }

  static async delete(id) {
    if (!id) {
      throw new Error("Falha! Nenhum Registro Localizado!");
    }

    if (isNaN(id)) {
      throw new Error("Falha! Nenhum Registro Localizado!!");
    }

    let config = await Configuracao.find(parseInt(id));
    if (!config) {
      throw new Error("Falha! Nenhum Registro Localizado!!!");
    }

    await config.delete();
  }
}

module.exports = ConfiguracaoService;
