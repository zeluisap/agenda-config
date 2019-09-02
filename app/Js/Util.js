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

    let
      rota = null,
      ip = null,
      pessoa = null,
      especialidade = null,
      data_inicio = null,
      data_fim = null;

      if(params){
        if(params.rota){
          rota = params.rota;
        }

        if(params.ip){
          ip = params.ip;
        }

        if(params.pessoa){
          pessoa = params.pessoa;
        }

        if(params.especialidade){
          especialidade = params.especialidade;
        }

        if(params.data_inicio && params.data_fim){
          data_inicio = params.data_inicio;
          data_fim = params.data_fim;
        }

      }

      return rota, ip, pessoa, especialidade, data_inicio, data_fim;
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
        return moment(strDateTime);
      }

      let timePartes = partes[1].split(":");
      if (!(timePartes && timePartes.length)) {
        return moment(partes[0]);
      }

      if (timePartes.length > 4) {
        return moment(partes[0]);
      }

      if (timePartes.length < 4) {
        return moment(strDateTime);
      }

      //timepartes.length === 4
      let micro = timePartes[3];
      if (micro.length <= 4) {
        return moment(strDateTime);
      }
      micro = micro.substring(0, 4);

      const tamanho = timePartes.length;
      timePartes = timePartes.filter((v, idx) => idx !== tamanho - 1);

      const strTempo = partes[0] + " " + timePartes.join(":") + "." + micro;

      return moment(strTempo);
    } catch (error) {
      console.error({
        strDateTime,
        error: error.message
      });
      return null;
    }
  }
}

module.exports = Util;
