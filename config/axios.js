const axios = require("axios");
const env = use("Env");

const obj = axios.create({
  baseURL: env.get("TJAP_BACKEND", "http://10.10.50.224/back/api/")
  // timeout: 2000,
  // headers: { "X-Custom-Header": "foobar" }
});

module.exports = obj;
