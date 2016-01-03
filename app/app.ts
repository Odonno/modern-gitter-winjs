/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./configs/routing.ts"/>
/// <reference path="./directives/ngEnter.ts"/>

// create module with references
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);

// inject config
appModule.config(($stateProvider, $urlRouterProvider) => new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider));

// TODO : inject services

// inject directives
appModule.directive('ngEnter', () => new Application.Directives.NgEnter());
    
// TODO : inject controllers