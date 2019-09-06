const axios = require("axios");
const env = use("Env");

const obj = axios.create({
  baseURL: env.get('TJAP_BACKEND', 'http://localhost/etucujurisbackend/src/'),
  timeout: 2000,
  headers: {'X-Custom-Header': 'foobar'}
});

module.exports = obj;
