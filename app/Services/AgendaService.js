"use strict";

const Database = use("Database");
const Helpers = use("Helpers");
// const Agendamento = use("App/Models/Agendamento");
const Agenda = use("App/Models/Agenda");

const moment = require("moment");

class AgendaService {
  static async store(ctx) {
    const { request, tjap_auth, response } = ctx;

    const params = request.all();

    let obj = new Agenda();
    if (params.id) {
      obj = await this.getPorId(params.id);
    }

    if (params.descricao) {
      obj.descricao = params.descricao.toUpperCase();
    }

    if (params.url) {
      obj.url = params.url.toLowerCase();
    }

    if (params.intervalo !== undefined && params.intervalo !== null) {
      obj.intervalo = params.intervalo;
    }

    if (params.ativo !== undefined && params.ativo !== null) {
      obj.ativo = params.ativo;
    }

    // const erros = await obj.erros();

    // if (erros && erros.length) {
    //   return response.status(400).send({
    //     erros,
    //   });
    // }

    await obj.save();

    return obj;
  }

  static async get(id) {
    if (!id) {
      throw new Error("Agendamento não encontrado!");
    }

    const obj = await this.getPorId(id);

    if (!obj) {
      throw new Error("Agendamento não localizado!");
    }

    return obj;
  }

  static async delete(id) {
    if (!id) {
      throw new Error("Agendamento não encontrado!");
    }

    const obj = await this.getPorId(id);

    if (!obj) {
      throw new Error("Agendamento não localizado!");
    }

    await obj.delete();

    return "ok";
  }

  static async getPorId(id) {
    if (!id) {
      return null;
    }

    // return await Agendamento.query()
    //   .where("id", "=", id)
    //   .on("query", console.log)
    //   .first();

    return await Agenda.findOne({
      _id: id,
    });
  }

  static async listar(ctx) {
    // return await Agendamento.all();
    return await Agenda.find();
  }
}

module.exports = AgendaService;
