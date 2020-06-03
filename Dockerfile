FROM node:11

# COPY . /app

WORKDIR /app

RUN npm install -g @adonisjs/cli
# RUN npm install

CMD ["adonis", "serve", "--dev"]
