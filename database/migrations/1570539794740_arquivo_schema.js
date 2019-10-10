"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArquivoSchema extends Schema {
  up() {
    this.create("arquivos", table => {
      table.increments(),
        table.string("filename").notNullable(),
        table.string("extensao").notNullable(),
        table.string("mime_type").notNullable(),
        table.string("hash").notNullable(),
        table.integer("size").notNullable(),
        table.string("tucujuris_token"),
        table.integer("tucujuris_pessoa_id"),
        table.string("tucujuris_login"),
        table.string("tucujuris_nome"),
        table.timestamps();
    });
  }

  down() {
    this.drop("arquivos");
  }
}

module.exports = ArquivoSchema;
