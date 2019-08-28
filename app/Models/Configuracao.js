'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Configuracao extends Model {

  static get table () {
    return 'configuracao'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  getParametroLogar() {

    if (!this.parametro_logar) {
      return null;
    }

    const parametros = this.parametro_logar.split(',');

    if (!(parametros && parametros.length)) {
      return null;
    }

    return parametros.map( item => item.trim() );
  }

  getParametroIgnorar() {

    if (!this.parametro_ignorar) {
      return null;
    }

    const parametros = this.parametro_ignorar.split(',');

    if (!(parametros && parametros.length)) {
      return null;
    }

    return parametros.map( item => item.trim() );
  }
}

module.exports = Configuracao
