
var mongoose = require('mongoose');

module.exports = function (uri) {

  mongoose.connect(uri);

  mongoose.connection.on('connected', function () {
    console.log('Mongoose connected on %s', uri);
  });

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected on %s', uri);
  });

  mongoose.connection.on('error', function (error) {
    console.log('Mongoose error on %s: %s', uri, error);
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose exited on process exit');
      process.exit(0);
    });
  });

};
