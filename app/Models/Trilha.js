'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const moment = require("moment");

class Trilha extends Model {

  static get table () {
    return 'trilha'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  static get computed () {
    return ['tempo']
  }

  requests() {
    return this.hasMany("App/Models/Request", 'id', 'fk_trilha');
  }

  sessoes() {
    return this.hasMany("App/Models/Sessao", 'id', 'fk_trilha');
  }

  ips() {
    return this.hasMany("App/Models/Ip", 'id', 'fk_trilha');
  }

  getTempo() {
    const inicio = moment(this.data_request);
    const fim = moment(this.data_response);
    return fim.diff(inicio, "ms");
  }

}

module.exports = Trilha
