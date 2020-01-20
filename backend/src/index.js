const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app); //isto traz o servidor HTTP para fora do express, para podermos usar no websocket tbm

setupWebsocket(server);

mongoose.connect('mongodb://omnistack:omnistack@cluster0-shard-00-00-gkpls.mongodb.net:27017,cluster0-shard-00-01-gkpls.mongodb.net:27017,cluster0-shard-00-02-gkpls.mongodb.net:27017/week10?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

app.use(cors());// libera acesso externo para todo tipo de aplicacao
app.use(express.json()); //tem de vir antes das rotas, senao nao vai ser possivel usar JSON nas rotas
app.use(routes);

server.listen(3333);
