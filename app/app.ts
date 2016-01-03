/// <reference path="../typings/tsd.d.ts" />

/// <reference path="./configs/routing.ts"/>

/// <reference path="./services/apiService.ts"/>
/// <reference path="./services/configService.ts"/>
/// <reference path="./services/featureToggleService.ts"/>
/// <reference path="./services/networkService.ts"/>
/// <reference path="./services/oauthService.ts"/>
/// <reference path="./services/realtimeApiService.ts"/>
/// <reference path="./services/roomsService.ts"/>
/// <reference path="./services/toastNotificationService.ts"/>

/// <reference path="./directives/ngEnter.ts"/>

/// <reference path="./controllers/addChannelRoomCtrl.ts"/>
/// <reference path="./controllers/addOneToOneRoomCtrl.ts"/>
/// <reference path="./controllers/addRepositoryRoomCtrl.ts"/>
/// <reference path="./controllers/addRoomCtrl.ts"/>
/// <reference path="./controllers/homeCtrl.ts"/>
/// <reference path="./controllers/roomCtrl.ts"/>
/// <reference path="./controllers/roomsCtrl.ts"/>

// create module with references
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);

// inject config
appModule.config(($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider));

// inject services
appModule.service('ApiService', (ConfigService: Application.Services.ConfigService, OAuthService: Application.Services.OAuthService) => new Application.Services.ApiService(ConfigService, OAuthService));
appModule.service('ConfigService', () => new Application.Services.ConfigService());
appModule.service('FeatureToggleService', () => new Application.Services.FeatureToggleService());
appModule.service('NetworkService', (FeatureToggleService) => new Application.Services.NetworkService(FeatureToggleService));
appModule.service('OAuthService', (ConfigService: Application.Services.ConfigService) => new Application.Services.OAuthService(ConfigService));
appModule.service('RealtimeApiService', (OAuthService: Application.Services.OAuthService) => new Application.Services.RealtimeApiService(OAuthService));
appModule.service('RoomsService', (OAuthService: Application.Services.OAuthService, NetworkService: Application.Services.NetworkService, ApiService: Application.Services.ApiService, RealtimeApiService: Application.Services.RealtimeApiService, ToastNotificationService: Application.Services.ToastNotificationService) => new Application.Services.RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService));
appModule.service('ToastNotificationService', (FeatureToggleService) => new Application.Services.ToastNotificationService(FeatureToggleService));

// inject directives
appModule.directive('ngEnter', () => new Application.Directives.NgEnter());
    
// inject controllers
appModule.controller('AddChannelRoomCtrl', ($scope, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddOneToOneRoomCtrl', ($scope, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddRepositoryRoomCtrl', ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddRoomCtrl', ($scope) => new Application.Controllers.AddRoomCtrl($scope));
appModule.controller('HomeCtrl', ($scope, RoomsService, FeatureToggleService) => new Application.Controllers.HomeCtrl($scope, RoomsService, FeatureToggleService));
appModule.controller('RoomCtrl', ($scope, ApiService, RoomsService) => new Application.Controllers.RoomCtrl($scope, ApiService, RoomsService));
appModule.controller('RoomsCtrl', ($scope, $filter, $state, RoomsService) => new Application.Controllers.RoomsCtrl($scope, $filter, $state, RoomsService));