var express = require('express');
var app = express();
var cors = require('cors');
var route = require('./routes/route-estabelecimento');
require('./config/mongo-db.js')('mongodb://localhost/estabelecimentos');

app.use(cors());
app.use('/estabelecimento-api', route);

module.exports = app;
