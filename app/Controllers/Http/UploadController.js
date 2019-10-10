"use strict";

const Helpers = use("Helpers");
const ArquivoService = use("App/Services/ArquivoService");

class UploadController {
  async store(ctx) {
    return ArquivoService.store(ctx);
  }

  async get(ctx) {
    const { params } = ctx;

    if (!params.id) {
      throw new Error("Nenhum Arquivo Encontrado!");
    }

    const arquivo = await ArquivoService.get(params.id);
    if (!arquivo.token) {
      return arquivo;
    }
  }

  async delete({ params }) {
    if (!params.id) {
      throw new Error("Nenhum Arquivo Encontrado!");
    }

    return ArquivoService.delete(params.id);
  }

  async download({ params, response }) {
    if (!params.id) {
      throw new Error("Nenhum Arquivo Encontrado!");
    }

    const arquivo = await ArquivoService.get(params.id);
    if (!arquivo) {
      throw new Error("Nenhum Arquivo Encontrado!!");
    }

    return response.attachment(
      Helpers.tmpPath("uploads/" + arquivo.hash),
      arquivo.filename
    );
  }

  async agenda({ params, response }) {
    try {
      const resp = await ArquivoService.agenda();
      return response.status(200).send(resp);
    } catch (error) {
      return response.status(500).send(error.message);
    }
  }
}

module.exports = UploadController;
