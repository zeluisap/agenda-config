# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Instalar o Adonis e PM2 Globalmente:

```bash
sudo npm i -g @adonisjs/cli
sudo npm i -g pm2
```

Instalar as Dependências do Adonis:

```bash
npm i
```

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```


### PM2 Services

Iniciar o serviço usando pm2 para gerenciar
```bash
sudo pm2 start server.js
```

Acompanhamento dos serviços executando atraves do pm2
```bash
sudo pm2 monit
```

Parar um serviço executando no pm2
```bash
sudo pm2 stop server
```

