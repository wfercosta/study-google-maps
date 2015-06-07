'use strict';

/**
 * @ngdoc overview
 * @name estabelecimentoApp
 * @description
 * # estabelecimentoApp
 *
 * Main module of the application.
 */
angular
  .module('estabelecimentoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/estabelecimentos', {
        templateUrl: 'views/estabelecimentos.html',
        controller: 'EstabelecimentosCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
