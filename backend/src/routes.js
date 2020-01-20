const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

//Metodos HTTP: get, post, put, delete

//Tipos de parametros

// Query Params: acessiveis atraves do `request.query` e sao usados para (filtros, ordenacao, paginacao....)
// Route Params: praticamente exclusivos nos metodos `put` e `delete`. Acessamos no `request.params` (identificar um recurso na alteracao ou remocao)
// Body: acessamos em request.body (sao dados para criacao ou alteracao de um registro)

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.put('/devs/:github_username', DevController.update);

routes.get('/search', SearchController.index);

module.exports = routes; 
