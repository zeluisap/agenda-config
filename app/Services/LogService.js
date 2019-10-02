"use strict";

const Database = use("Database");
const Trilha = use("App/Models/Trilha");
const Request = use("App/Models/Request");
const Response = use("App/Models/Response");
const Sessao = use("App/Models/Sessao");
const Ip = use("App/Models/Ip");
const Configuracao = use("App/Models/Configuracao");
const Util = use("App/Js/Util");
const configService = use("App/Services/ConfiguracaoService");

const moment = require("moment");

class LogService {
  static async save(ctx) {
    try {
      const { request } = ctx;

      const params = request.all();

      // let log = {
      //   rota: params.rota,
      //   request: params.request
      // };

      // if (params.sessao && params.sessao.pessoa && params.sessao.pessoa.nome) {
      //   log.usuario = params.sessao.pessoa.nome;
      // }

      // console.log({
      //   log
      // });

      const trilha = new Trilha();

      const dataInicio = Util.getStringDate(params.request_inicio);
      const dataFim = Util.getStringDate(params.request_fim);

      trilha.url = params.url;
      // trilha.ip = params.ip;
      trilha.rota = params.rota;
      trilha.data_request = dataInicio;
      trilha.data_response = dataFim;

      trilha.sucesso =
        params &&
        params.response &&
        params.response.status &&
        params.response.status.toLowerCase() === "ok";

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

      await Database.transaction(async trx => {
        const config = this.getConfig(trilha);

        if (config && !config.logar) {
          return;
        }

        await trilha.save(trx);

        await this.salvarRequest({
          request: params.request,
          trilha,
          trx,
          config
        });

        if (config.logar_resposta) {
          await this.salvarResponse({
            response: params.response,
            trilha,
            trx,
            config
          });
        }

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

      return trilha;
    } catch (error) {
      console.error(error);
    }
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
      let valor = sessao[prop];

      if (!valor) {
        continue;
      }

      const fullPropName = (namespace ? namespace + "." : "") + prop;

      if (fullPropName === "permissoes") {
        valor = valor.sort().join(", ");
      } else if (typeof valor === "object") {
        await this.salvarSessao({
          sessao: valor,
          trilha,
          trx,
          namespace: fullPropName
        });
        continue;
      }

      const salvar_apenas = [
        "comarca.id",
        "comarca.descricao",
        "especialidade.id",
        "especialidade.assinatura",
        "especialidade.matricula",
        "especialidade.tipo_especialidade",
        "especialidade.login_exclusivo",
        "lotacao.id",
        "lotacao.descricao",
        "pessoa.id",
        "pessoa.nome",
        "permissoes",
        "token"
      ];

      const deve_salvar = salvar_apenas.some(
        item => fullPropName.toLowerCase() === item.toLowerCase()
      );
      if (!deve_salvar) {
        continue;
      }

      const s = new Sessao();
      s.fk_trilha = trilha.id;
      s.chave = fullPropName;
      s.valor = valor;
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

      if (!Array.isArray(valor)) {
        valor = [valor];
      }

      for (const vlr of valor) {
        const ip = new Ip();
        ip.fk_trilha = trilha.id;
        ip.chave = prop;
        ip.valor = vlr;
        await ip.save(trx);
      }
    }
  }

  static async grafico(ctx) {
    let { tipo_grafico, data_ini, data_fim, status } = ctx.request.all();

    return await Trilha.query()
      .select("trilha.*")
      .from("trilha")
      .where(function() {
        //if(tipo_grafico==='acesso'){
        this.whereRaw("TO_CHAR(data_request, 'dd/mm/yyyy') between ? and ?", [
          data_ini,
          data_fim
        ]);
        //}
      })
      .groupBy("TO_CHAR(data_request, 'dd/mm/yyyy')")
      .orderBy("data_request desc");
  }

  static async report(ctx) {
    let {
      order_key,
      order_reverse,
      rota,
      pessoa,
      especialidade,
      data_ini,
      data_fim,
      texto,
      status
    } = ctx.request.all();
    if (!order_key) {
      order_key = "data_request";
      order_reverse = "desc";
    }

    if (!order_reverse) {
      order_reverse = "asc";
    }

    const { page, perPage } = Util.getPagination(ctx);

    return await Trilha.query()
      .where(function() {
        if (rota) {
          this.whereRaw(
            "upper(rota) LIKE '%' || upper(?) || '%' ",
            rota.toUpperCase()
          );
        }

        if (pessoa) {
          this.whereRaw(
            "upper(pessoa) LIKE '%' || upper(?) || '%' ",
            pessoa.toUpperCase()
          );
        }

        if (especialidade) {
          this.whereRaw(
            "upper(especialidade) LIKE '%' || upper(?) || '%' ",
            especialidade.toUpperCase()
          );
        }

        if (data_ini && data_fim) {
          this.whereRaw("data_request between ? and ?", [data_ini, data_fim]);
        }

        if (texto) {
          this.whereRaw(
            "upper(rota) ||' '|| upper(especialidade) ||' '|| upper(pessoa) ||' '|| TO_CHAR(data_request, 'dd/mm/yyyy') LIKE '%' || upper(?) || '%' ",
            texto.toUpperCase()
          );
        }

        if (status !== null && status !== undefined) {
          this.whereRaw("sucesso = ?", JSON.parse(status));
        }
      })
      .orderBy(order_key, order_reverse)
      .on("query", console.log)
      .paginate(page, perPage);
  }

  static async showTrilha(id) {
    if (!id) {
      throw new Error("Nenhuma Trilha Informada!");
    }

    const obj = await Trilha.query()
      .where("id", "=", id)
      .first();

    if (!obj) {
      throw new Error("Nenhuma Trilha Informada!");
    }

    obj.request = await obj
      .requests()
      .orderBy("chave")
      .fetch();

    obj.sessao = await obj
      .sessoes()
      .orderBy("chave")
      .fetch();

    obj.ip = await obj
      .ips()
      .orderBy("chave")
      .fetch();

    return obj;
  }

  static async showResponse(id) {
    if (!id) {
      throw new Error("Nenhuma trilha informada!");
    }

    const objs = await Response.query()
      .where("fk_trilha", "=", id)
      .orderBy("chave", "asc")
      .fetch();

    return objs;
  }

  static async getConfig(trilha) {
    if (!trilha.rota) {
      return {
        logar: false
      };
    }

    let config = await Configuracao.query()
      .whereRaw("lower(rota) = ?", trilha.rota.toLowerCase())
      .first();

    if (config) {
      return config;
    }

    return await this.criaConfig(trilha);
  }

  static async criaConfig(trilha) {
    if (!(trilha && trilha.rota)) {
      return {
        logar: false
      };
    }

    return configService.salvar({
      rota: trilha.rota,
      logar: true,
      logar_resposta: false
    });
  }
}

module.exports = LogService;
