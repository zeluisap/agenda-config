"use strict";

const Database = use("Database");
const Configuracao = use("App/Models/Configuracao");
const Util = use("App/Js/Util");

class ConfiguracaoService {
  static async listar(ctx) {
    const { request } = ctx;
    const { page, perPage } = Util.getPagination(ctx);

    return Configuracao.query()
      .where(function() {
        const { rota } = request.only(["rota"]);
        if (rota) {
          this.where("rota", "=", rota);
        }
      })
      .paginate(page, perPage);
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
      throw new Error("Falha! Rota Já Cadastrada!");
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
