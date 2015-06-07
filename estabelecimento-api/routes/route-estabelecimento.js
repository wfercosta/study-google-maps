var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var controller = require('../controller/controller-estabelecimento');

router.use(bodyParser.json());

router.route('/estabelecimentos')
  .get(controller.listar)
  .post(controller.salvar);


router.route('/estabelecimentos/:id')
  .get(controller.obter)
  .put(controller.atualizar);


module.exports = router;
