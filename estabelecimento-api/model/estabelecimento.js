
var domain = require('../domain/estabelecimento.js');

exports.listar = function (filtro, callback) {
  //6371 é o raio aproximado da Terra

 var Estabelecimento = domain.Estabelecimento();

 Estabelecimento.find({
    loc: {
      $near: filtro.loc || [],
      $maxDistance: (filtro.distance || 8) / 6371
    } 
  }).limit(filtro.limit || 10).exec(function(err, data) {
    callback(err, data);
  });
};


exports.salva = function (estabelecimento, callback) {
  var Estabelecimento = domain.Estabelecimento();
  Estabelecimento.create(estabelecimento, callback);
};
