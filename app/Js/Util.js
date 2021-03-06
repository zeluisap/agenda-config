"use strict";

const moment = require("moment");
const _ = require("lodash");

class Util {
  static async tucujurisResponse(dados) {
    try {
      if (dados instanceof Promise) {
        dados = await dados;
      }

      return {
        status: "OK",
        dados
      };
    } catch (error) {
      return {
        status: "ERRO",
        dados: null,
        mensagem: error.message
      };
    }
  }

  static getFiltro(ctx) {
    const { request } = ctx;

    const params = request.all();

    if (!(params && params.length)) {
      return {};
    }

    const filters = [
      "rota",
      "ip",
      "pessoa",
      "especialidade",
      "data_inicio",
      "data_fim"
    ];

    let retorno = [];

    for (const filter of filters) {
      if (!params.hasOwnProperty(filter)) {
        continue;
      }
      retorno[filter] = params[filter];
    }

    return retorno;
  }

  static getPagination(ctx) {
    const { request } = ctx;

    const params = request.all();

    let page = 1;
    let perPage = 15;

    if (params) {
      if (params.page) {
        page = params.page;
      }

      if (params.perPage) {
        perPage = params.perPage;
      } else if (params.perpage) {
        perPage = params.perpage;
      } else if (params.per_page) {
        perPage = params.per_page;
      }
    }

    return {
      page,
      perPage
    };
  }

  static getMoment(strDateTime) {
    try {
      strDateTime = this.getStringDate(strDateTime);

      if (!strDateTime) {
        return null;
      }

      return moment(strDateTime);
    } catch (error) {
      console.error({
        strDateTime,
        error: error.message
      });
      return null;
    }
  }

  static getStringDate(strDateTime) {
    try {
      if (!(strDateTime && strDateTime.trim())) {
        return null;
      }

      strDateTime = strDateTime.trim();

      const partes = strDateTime.split(" ");

      if (!(partes && partes.length)) {
        return null;
      }

      if (partes.length > 2) {
        return null;
      }

      if (partes.length === 1) {
        return strDateTime;
      }

      let timePartes = partes[1].split(":");
      if (!(timePartes && timePartes.length)) {
        return partes[0];
      }

      if (timePartes.length > 4) {
        return partes[0];
      }

      if (timePartes.length < 4) {
        return strDateTime;
      }

      //timepartes.length === 4
      let micro = timePartes[3];
      if (micro.length <= 4) {
        return strDateTime;
      }
      micro = micro.substring(0, 4);

      const tamanho = timePartes.length;
      timePartes = timePartes.filter((v, idx) => idx !== tamanho - 1);

      const strTempo = partes[0] + " " + timePartes.join(":") + "." + micro;

      return strTempo;
    } catch (error) {
      return null;
    }
  }

  static getBinarySize(obj_or_string) {
    if (typeof obj_or_string === "object") {
      obj_or_string = JSON.stringify(obj_or_string);
    }

    return Buffer.byteLength(obj_or_string, "utf8");
  }
}

module.exports = Util;
