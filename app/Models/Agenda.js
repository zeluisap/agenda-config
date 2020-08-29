"use strict";

const BaseModel = use("MongooseModel");

/**
 * @class Agenda
 */
class Agenda extends BaseModel {
  static boot({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'AgendaHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Agenda's schema
   */
  static get schema() {
    return {
      descricao: String,
      ultimaExecucao: Date,
      url: String,
      intervalo: Number,
      ativo: Boolean,
    };
  }
}

module.exports = Agenda.buildModel("Agenda");
