"use strict";

const LogService = use("App/Services/LogService");
const Util = use("App/Js/Util");

class LogController {
  async save(ctx) {
    return LogService.save(ctx);
  }

  async report(ctx) {
    return LogService.report(ctx);
  }

  async grafico(ctx) {

    return LogService.grafico(ctx);

  }

  async showTrilha(ctx) {
    const { params } = ctx;

    if (!params.id) {
      throw new Error("Nenhuma Sessão Informada!");
    }

    return LogService.showTrilha(params.id);
  }

  async showResponse(ctx) {
    const { params } = ctx;

    if (!params.id) {
      throw new Error("Nenhuma Sessão Informada!");
    }

    return LogService.showResponse(params.id);
  }
}

module.exports = LogController;
