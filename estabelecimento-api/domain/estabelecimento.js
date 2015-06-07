var mongoose = require('mongoose');

exports.Estabelecimento = function () {

  var schema = mongoose.Schema({
    nome: {
	type: String,
        required:true
     },
     endereco: {
       type: String,
       required:true
     },
     loc: {
       type: [Number], //[<Longitude>,<Latitude>]
       index: '2d'
     }	  
  });


 return  mongoose.model('Estabelecimento', schema);

};

