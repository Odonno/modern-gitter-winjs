/// <reference path="../typings/tsd.d.ts" />

/// <reference path="./models/messageOperation.ts"/>

/// <reference path="./configs/routing.ts"/>

/// <reference path="./services/apiService.ts"/>
/// <reference path="./services/configService.ts"/>
/// <reference path="./services/featureToggleService.ts"/>
/// <reference path="./services/localSettingsService.ts"/>
/// <reference path="./services/networkService.ts"/>
/// <reference path="./services/oauthService.ts"/>
/// <reference path="./services/realtimeApiService.ts"/>
/// <reference path="./services/roomsService.ts"/>
/// <reference path="./services/toastNotificationService.ts"/>

/// <reference path="./directives/ngEnter.ts"/>

/// <reference path="./controllers/addChannelRoomCtrl.ts"/>
/// <reference path="./controllers/addExistingRoomCtrl.ts"/>
/// <reference path="./controllers/addOneToOneRoomCtrl.ts"/>
/// <reference path="./controllers/addRepositoryRoomCtrl.ts"/>
/// <reference path="./controllers/addRoomCtrl.ts"/>
/// <reference path="./controllers/appCtrl.ts"/>
/// <reference path="./controllers/errorCtrl.ts"/>
/// <reference path="./controllers/homeCtrl.ts"/>
/// <reference path="./controllers/roomCtrl.ts"/>
/// <reference path="./controllers/roomsCtrl.ts"/>
/// <reference path="./controllers/splashscreenCtrl.ts"/>

// create module with references
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router', 'ui-listView']);

// inject config
appModule.config(($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider));
appModule.run(($rootScope, $state, RoomsService: Application.Services.RoomsService, FeatureToggleService: Application.Services.FeatureToggleService) => {
    var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    $rootScope.states = [];
    $rootScope.previousState;
    $rootScope.currentState;

    $rootScope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {
        $rootScope.currentState = to.name;

        // remove navigation stack if we are before the home page (start app / splashscreen)
        if (!from.name || from.name === 'splashscreen') {
            return;
        }

        // handle error on navigation
        if (FeatureToggleService.isErrorHandled()) {
            // navigate to error page when there is no selected room
            if (to.name === 'room' && !RoomsService.currentRoom) {
                $state.go('error');
            }
            if (to.name === 'error') {
                return;
            }
        }

        if ($rootScope.previousState !== $rootScope.currentState) {
            $rootScope.previousState = from.name;
            systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            
            // add current state to history
            $rootScope.states.push({
                state: $rootScope.previousState,
                params: fromParams
            });
        }
    });

    systemNavigationManager.onbackrequested = (args) => {
        if ($rootScope.states.length > 0) {
            // retrieve and remove last state from history
            var previous = $rootScope.states.pop();
            
            // handle error on navigation
            if (FeatureToggleService.isErrorHandled()) {
                // remove error page from navigation stack if there is a current room now
                while (previous.state === 'error' && RoomsService.currentRoom) {
                    previous = $rootScope.states.pop();
                }
            }
            
            $rootScope.previousState = previous.state;
            
            // go back to previous page
            $state.go(previous.state, previous.params);

            if ($rootScope.states.length === 0) {
                systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
            }

            args.handled = true;
        } else {
            systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
        }
    };
});

// inject services
appModule.service('ApiService', (ConfigService: Application.Services.ConfigService, OAuthService: Application.Services.OAuthService) => new Application.Services.ApiService(ConfigService, OAuthService));
appModule.service('ConfigService', () => new Application.Services.ConfigService());
appModule.service('FeatureToggleService', () => new Application.Services.FeatureToggleService());
appModule.service('LocalSettingsService', () => new Application.Services.LocalSettingsService());
appModule.service('NetworkService', (FeatureToggleService) => new Application.Services.NetworkService(FeatureToggleService));
appModule.service('OAuthService', (ConfigService: Application.Services.ConfigService) => new Application.Services.OAuthService(ConfigService));
appModule.service('RealtimeApiService', (OAuthService: Application.Services.OAuthService) => new Application.Services.RealtimeApiService(OAuthService));
appModule.service('RoomsService', (OAuthService: Application.Services.OAuthService, NetworkService: Application.Services.NetworkService, ApiService: Application.Services.ApiService, RealtimeApiService: Application.Services.RealtimeApiService, ToastNotificationService: Application.Services.ToastNotificationService) => new Application.Services.RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService));
appModule.service('ToastNotificationService', (FeatureToggleService) => new Application.Services.ToastNotificationService(FeatureToggleService));

// inject directives
appModule.directive('ngEnter', () => new Application.Directives.NgEnter());

// inject controllers
appModule.controller('AddChannelRoomCtrl', ($scope, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddExistingRoomCtrl', ($scope, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddExistingRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddOneToOneRoomCtrl', ($scope, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddRepositoryRoomCtrl', ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) => new Application.Controllers.AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService));
appModule.controller('AddRoomCtrl', ($scope) => new Application.Controllers.AddRoomCtrl($scope));
appModule.controller('AppCtrl', ($scope, $rootScope) => new Application.Controllers.AppCtrl($scope, $rootScope));
appModule.controller('ErrorCtrl', ($scope) => new Application.Controllers.ErrorCtrl($scope));
appModule.controller('HomeCtrl', ($scope, $state, RoomsService, FeatureToggleService, ToastNotificationService) => new Application.Controllers.HomeCtrl($scope, $state, RoomsService, FeatureToggleService, ToastNotificationService));
appModule.controller('RoomCtrl', ($scope, ApiService, RoomsService, LocalSettingsService, FeatureToggleService) => new Application.Controllers.RoomCtrl($scope, ApiService, RoomsService, LocalSettingsService, FeatureToggleService));
appModule.controller('RoomsCtrl', ($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService) => new Application.Controllers.RoomsCtrl($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService));
appModule.controller('SplashscreenCtrl', ($scope, $state, RoomsService, LocalSettingsService, FeatureToggleService) => new Application.Controllers.SplashscreenCtrl($scope, $state, RoomsService, LocalSettingsService, FeatureToggleService));