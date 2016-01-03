/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./configs/routing.ts"/>

// create module with references
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);

// inject config
appModule.config(($stateProvider, $urlRouterProvider) => new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider));

// TODO : inject services

// TODO : inject directives

// TODO : inject controllers