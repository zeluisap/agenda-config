"use strict";

const LogService = use("App/Services/LogService");

class LogController {

  async save(ctx) {

    return await LogService.save(ctx);

  }

  async report(ctx) {
    const { request, response } = ctx;

    const params = request.all();

    return params;
  }

}

module.exports = LogController;
