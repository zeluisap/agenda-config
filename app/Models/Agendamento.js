"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Agendamento extends Model {
  static get table() {
    return "agendamento";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  async erros() {
    if (this.ativo === undefined || this.ativo === null) {
      this.ativo = false;
    }

    const erros = [];

    if (!this.descricao) {
      erros.push("Descrição não definida.");
    }

    if (!this.url) {
      erros.push("URL não definida.");
    }

    if (!this.intervalo) {
      erros.push("Intervalo não definido.");
    }

    if (erros && erros.length) {
      return erros;
    }

    let id = 0;
    if (this.id) {
      id = this.id;
    }

    //valida duplicado
    const obj = await Agendamento.query()
      .whereRaw("lower(url) = ?", [this.url.toLowerCase()])
      .whereRaw("id <> ?", [id])
      // .on("query", console.log)
      .count("id as quantidade")
      .first();

    if (parseInt(obj.quantidade)) {
      return ["Já existe um agendamento para esta rota!"];
    }

    return null;
  }
}

module.exports = Agendamento;
