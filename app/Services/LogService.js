"use strict";

const Database = use("Database");
const Trilha = use("App/Models/Trilha");
const Request = use("App/Models/Request");
const Response = use("App/Models/Response");
const Sessao = use("App/Models/Sessao");
const Ip = use("App/Models/Ip");
const Configuracao = use("App/Models/Configuracao");
const Util = use("App/Js/Util");

const moment = require("moment");

class LogService {
  static async save(ctx) {
    try {
      const { request } = ctx;

      const params = request.all();

      const trilha = new Trilha();

      const dataInicio = Util.getMoment(params.request_inicio);
      const dataFim = Util.getMoment(params.request_fim);

      trilha.url = params.url;
      // trilha.ip = params.ip;
      trilha.rota = params.rota;
      trilha.data_request = dataInicio;
      trilha.data_response = dataFim;

      const sessao = params.sessao;

      if (sessao) {
        if (sessao.token) {
          trilha.token = sessao.token;
        }

        if (sessao.pessoa && sessao.pessoa.nome) {
          trilha.pessoa = sessao.pessoa.nome;
        }

        if (sessao.especialidade && sessao.especialidade.tipo_especialidade) {
          trilha.especialidade = sessao.especialidade.tipo_especialidade;
        }
      }

      const config = await Configuracao.query()
        .where("rota", "=", trilha.rota)
        .first();

      if (config && !config.logar) {
        return;
      }

      await Database.transaction(async trx => {
        await trilha.save(trx);

        await this.salvarRequest({
          request: params.request,
          trilha,
          trx,
          config
        });

        await this.salvarResponse({
          response: params.response,
          trilha,
          trx,
          config
        });

        await this.salvarSessao({
          sessao,
          trilha,
          trx
        });

        await this.salvarIps({
          params,
          trilha,
          trx
        });
      });
    } catch (error) {
      console.error(error);
    }

    return trilha;
  }

  static async salvarSessao({ sessao, trilha, trx, namespace }) {
    if (!sessao) {
      return null;
    }

    if (!namespace) {
      namespace = "";
    }

    const props = Object.keys(sessao);

    for (const prop of props) {
      const valor = sessao[prop];

      if (!valor) {
        continue;
      }

      const fullPropName = (namespace ? namespace + "." : "") + prop;

      if (typeof valor === "object") {
        await this.salvarSessao({
          sessao: valor,
          trilha,
          trx,
          namespace: fullPropName
        });
        continue;
      }

      const s = new Sessao();
      s.fk_trilha = trilha.id;
      s.chave = fullPropName;
      s.valor = sessao[prop];
      await s.save(trx);
    }
  }

  static async salvarRequest({ request, trilha, trx, config, namespace }) {
    if (!request) {
      return null;
    }

    if (!namespace) {
      namespace = "";
    }

    const props = Object.keys(request);

    for (const prop of props) {
      if (prop.toUpperCase() === "XDEBUG_SESSION_START") {
        continue;
      }

      if (config) {
        const logar = config.getParametroLogar();
        const ignorar = config.getParametroIgnorar();

        if (logar && logar.length) {
          const some = logar.some(item => item === prop);
          if (!some) {
            continue;
          }
        }

        if (ignorar && ignorar.length) {
          const some = ignorar.some(item => item === prop);
          if (some) {
            continue;
          }
        }
      }

      const valor = request[prop];

      const fullPropName = (namespace ? namespace + "." : "") + prop;

      if (typeof valor === "object") {
        await this.salvarRequest({
          request: valor,
          trilha,
          trx,
          config,
          namespace: fullPropName
        });
        continue;
      }

      const p = new Request();
      p.fk_trilha = trilha.id;
      p.chave = fullPropName;
      p.valor = request[prop];
      await p.save(trx);
    }
  }

  static async salvarResponse({ response, trilha, trx, config, namespace }) {

    if (config && !config.logar_resposta) {
      return null;
    }

    if (!response) {
      return null;
    }

    if (!namespace) {
      namespace = "";
    }

    const props = Object.keys(response);

    for (const prop of props) {
      const valor = response[prop];

      const fullPropName = (namespace ? namespace + "." : "") + prop;

      if (typeof valor === "object") {
        await this.salvarResponse({
          response: valor,
          trilha,
          trx,
          config,
          namespace: fullPropName
        });
        continue;
      }

      const p = new Response();
      p.fk_trilha = trilha.id;
      p.chave = fullPropName;
      p.valor = response[prop];
      await p.save(trx);
    }
  }

  static async salvarIps({ params, trilha, trx }) {
    if (!(params && params.ip)) {
      return null;
    }

    const props = Object.keys(params.ip);

    for (const prop of props) {
      const valor = params.ip[prop];
      if (!valor) {
        continue;
      }

      const ip = new Ip();
      ip.fk_trilha = trilha.id;
      ip.chave = prop;
      ip.valor = params.ip[prop];
      await ip.save(trx);
    }
  }

  static async report(ctx) {

    const { page, perPage } = Util.getPagination(ctx);

    const { rota, ip, pessoa, especialidade, data_ini, data_fim } = Util.getFiltro(ctx);

    return await Trilha
      .query()
      .where(function(){
        this.where('1','=','1')
        if(rota){
          this.where('rota', 'like', '%'+rota+'%')
        }
        if(ip){
          this.where('ip', 'like', '%'+ip+'%')
        }
        if(pessoa){
          this.where('pessoa', 'like', '%'+pessoa+'%')
        }
        if(especialidade){
          this.where('especialidade', 'like', '%'+especialidade+'%')
        }
        if(data_ini && data_fim){
          this.whereBetween('data_request', [ data_ini, data_fim ])
        }
      })
      .orderBy('data_request', 'desc')
      .paginate(page, perPage);

  }

  static async showTrilha(id) {

    if (!id) {
      throw new Error("Nenhuma Trilha Informada!");
    }

    const obj = await Trilha
      .query()
      .where('id', '=', id)
      .first();

    if (!obj) {
      throw new Error("Nenhuma Trilha Informada!");
    }

    obj.request = await obj
      .requests()
      .orderBy('chave')
      .fetch();

    obj.sessao = await obj
      .sessoes()
      .orderBy('chave')
      .fetch();

    obj.ip = await obj
      .ips()
      .orderBy('chave')
      .fetch();

    return obj;
  }

  static async showResponse(id) {

    if (!id) {
      throw new Error("Nenhuma Trilha Informada!");
    }

    const objs = await Response
      .query()
      .where('fk_trilha', '=', id)
      .orderBy('chave', 'asc')
      .fetch();

    return objs;
  }

}

module.exports = LogService;
