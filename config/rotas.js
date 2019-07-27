const rotas = [
  {
    channel: 'sessao:*',
    controller: "SessaoVirtualController"
  },
  {
    channel: 'sessao-processo-update:*',
    controller: "SessaoVirtualProcessoController"
  },
];

module.exports = rotas;
