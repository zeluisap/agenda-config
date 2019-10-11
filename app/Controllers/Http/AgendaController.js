"use strict";

const Helpers = use("Helpers");
const AgendaService = use("App/Services/AgendaService");

class AgendaController {
  async index(ctx) {
    return AgendaService.listar(ctx);
  }

  async store(ctx) {
    return AgendaService.store(ctx);
  }

  async show(ctx) {
    const { params } = ctx;

    if (!params.id) {
      throw new Error("Nenhum Agendamento Encontrado!");
    }

    return await AgendaService.get(params.id);
  }

  async destroy({ params }) {
    if (!params.id) {
      throw new Error("Nenhum Agendamento Encontrado!");
    }

    return AgendaService.delete(params.id);
  }
}

module.exports = AgendaController;
