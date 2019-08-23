'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConnectionSchema extends Schema {
  up () {
    this.create('connections', (table) => {
      table.increments()
      table.string('ws_id').notNullable()
      table.string('topic').notNullable()
      table.string("token")
      table.string("nome")
      table.string("tipo_especialidade")
      table.timestamps()
    })
  }

  down () {
    this.drop('connections')
  }
}

module.exports = ConnectionSchema
