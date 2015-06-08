var _ = require('underscore');
var model = require('../model/estabelecimento.js');


exports.salvar = function (request, response) {

  var estabelecimento = _.clone(request.body);

  model.salva(estabelecimento, function(err, data) {
    if (err) return response.status(500).json(err);
    return response.status(200).json(data);
  });

};

exports.listar = function (request, response) {


  var filtro = {
     limit: request.query.limit,
     distance: request.query.distance,
     loc: [request.query.lng, request.query.lat]
  };

  model.listar(filtro, function(err, data) {
    if (err) return response.status(500).json(err);
    return response.status(200).json(data);
  });

};

exports.obter = function (request, response) {
  
  var id = _.clone(request.params.id);

};

exports.atualizar = function (request, response) {

  var id = _.clone(request.params.id);
  var estabelecimento = _.clone(request.body);
  
};


