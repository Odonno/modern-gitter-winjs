/// <reference path="../typings/tsd.d.ts" />

/// <reference path="./configs/routing.ts"/>

/// <reference path="./services/apiService.ts"/>
/// <reference path="./services/configService.ts"/>
/// <reference path="./services/networkService.ts"/>
/// <reference path="./services/oauthService.ts"/>
/// <reference path="./services/realtimeApiService.ts"/>
/// <reference path="./services/roomsService.ts"/>
/// <reference path="./services/toastNotificationService.ts"/>

/// <reference path="./directives/ngEnter.ts"/>

// create module with references
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);

// inject config
appModule.config(($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider));

// inject services
appModule.service('ApiService', (ConfigService: Application.Services.ConfigService, OAuthService: Application.Services.OAuthService) => new Application.Services.ApiService(ConfigService, OAuthService));
appModule.service('ConfigService', () => new Application.Services.ConfigService());
appModule.service('NetworkService', () => new Application.Services.NetworkService());
appModule.service('OAuthService', (ConfigService: Application.Services.ConfigService) => new Application.Services.OAuthService(ConfigService));
appModule.service('RealtimeApiService', (OAuthService: Application.Services.OAuthService) => new Application.Services.RealtimeApiService(OAuthService));
appModule.service('RoomsService', (OAuthService: Application.Services.OAuthService, NetworkService: Application.Services.NetworkService, ApiService: Application.Services.ApiService, RealtimeApiService: Application.Services.RealtimeApiService, ToastNotificationService: Application.Services.ToastNotificationService) => new Application.Services.RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService));
appModule.service('ToastNotificationService', () => new Application.Services.ToastNotificationService());

// inject directives
appModule.directive('ngEnter', () => new Application.Directives.NgEnter());
    
// TODO : inject controllers