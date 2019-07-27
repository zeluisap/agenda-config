const axios = require("axios");

const obj = axios.create({
  baseURL: 'http://10.10.50.224:8087/src/api',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});


module.exports = obj;
