"use strict";

const Database = use("Database");
const Drive = use("Drive");
const Helpers = use("Helpers");
const Arquivo = use("App/Models/Arquivo");
const Hash = use("crypto");

const moment = require("moment");
const sanitize = require("sanitize-filename");
const removeAcents = require("remove-accents");

const Env = use("Env");

class ArquivoService {
  static async store(ctx) {
    const { request, tjap_auth } = ctx;

    const arquivo = request.file("arquivo");

    const hash = Hash.createHash("md5")
      .update(arquivo.tmpPath)
      .digest("hex");

    await arquivo.move(Helpers.tmpPath("uploads"), {
      name: hash,
      overwrite: true
    });

    if (!arquivo.moved()) {
      return arquivo.error();
    }

    const arq = new Arquivo();

    // arq.hash = (await Hash.make(arquivo.tmpPath)).toUpperCase();
    arq.hash = hash;

    arq.filename = removeAcents(
      sanitize(arquivo.clientName, {
        replacement: "_"
      })
        .replace(/ /g, "_")
        .toLowerCase()
    );

    arq.size = arquivo.size;
    arq.extensao = arquivo.extname;
    arq.mime_type = arquivo.type + "/" + arquivo.subtype;

    if (tjap_auth) {
      if (tjap_auth.token) {
        arq.tucujuris_token = tjap_auth.token;
      }
      if (tjap_auth.pessoa && tjap_auth.pessoa.id) {
        arq.tucujuris_pessoa_id = tjap_auth.pessoa.id;
      }
      if (tjap_auth.pessoa && tjap_auth.pessoa.nome) {
        arq.tucujuris_nome = tjap_auth.pessoa.nome;
      }
      if (tjap_auth.especialidade && tjap_auth.especialidade.login) {
        arq.tucujuris_login = tjap_auth.especialidade.login;
      }
    }

    await arq.save();

    return arq;
  }

  static async get(id) {
    if (!id) {
      throw new Error("Arquivo não encontrado!");
    }

    const obj = await this.getPorId(id);

    if (!obj) {
      throw new Error("Arquivo não localizado!");
    }

    return obj;
  }

  static async getFilename(arquivo) {
    if (!(arquivo && arquivo.hash)) {
      return null;
    }
    return Helpers.tmpPath("uploads/" + arquivo.hash);
  }

  static async delete(id) {
    if (!id) {
      throw new Error("Arquivo não encontrado!");
    }

    const obj = await this.getPorId(id);

    if (!obj) {
      throw new Error("Arquivo não localizado!");
    }

    const filename = await this.getFilename(obj);

    await obj.delete();

    if (!filename) {
      return "ok";
    }

    const existe = await Drive.exists(filename);

    if (!existe) {
      return "ok";
    }

    await Drive.delete(filename);

    return "ok";
  }

  static async getPorId(id) {
    if (!id) {
      return null;
    }

    const query = Arquivo.query();

    if (isNaN(id)) {
      query.where("hash", "=", id);
    } else {
      query.where("id", "=", id);
    }

    return await query.on("query", console.log).first();
  }

  static async agenda() {
    const max = Env.get("MAX_TEMPO_VIDA_ARQUIVO") || 15;

    console.log({
      tempo: max
    });

    const maximoTempo = moment().subtract(max, "minutes");

    const arquivos = await Database.raw(
      `
      select id, hash, created_at, updated_at
      from arquivos
      where (updated_at < ?)
    `,
      [maximoTempo.format("YYYY-MM-DD HH:mm:ss")]
    );

    if (!(arquivos && arquivos.rows && arquivos.rows.length)) {
      throw new Error("Nenhum Arquivo a Processar!");
    }

    let sucesso = 0;
    for (const arquivo of arquivos.rows) {
      try {
        await this.delete(arquivo.id);
        sucesso++;
      } catch (error) {}
    }

    if (!sucesso) {
      throw new Error("Nenhum Arquivo Removido!");
    }

    return sucesso + " arquivo(s) removidos(s).";
  }
}

module.exports = ArquivoService;
