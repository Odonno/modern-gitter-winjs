/// <reference path="../../typings/tsd.d.ts" />

module Application.Configs {
    export class RoutingConfig {
        constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
            $urlRouterProvider.otherwise('/splashscreen');

            $stateProvider
                .state('error', {
                    url: '/error',
                    templateUrl: 'partials/error.html',
                    controller: 'ErrorCtrl',
                    params: {
                        errorType: null
                    }
                })
                .state('splashscreen', {
                    url: '/splashscreen',
                    templateUrl: 'partials/splashscreen.html',
                    controller: 'SplashscreenCtrl'
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                })
                .state('about', {
                    url: '/about',
                    templateUrl: 'partials/about.html',
                    controller: 'AboutCtrl'
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'partials/settings.html',
                    controller: 'SettingsCtrl'
                })
                .state('addRoom', {
                    abstract: true,
                    url: '/addRoom',
                    templateUrl: 'partials/addRoom.html',
                    controller: 'AddRoomCtrl'
                })
                .state('addRoom.suggested', {
                    url: '/suggested',
                    templateUrl: 'partials/addRoom/suggested.html',
                    controller: 'AddSuggestedRoomCtrl'
                })
                .state('addRoom.existing', {
                    url: '/existing',
                    templateUrl: 'partials/addRoom/existing.html',
                    controller: 'AddExistingRoomCtrl'
                })
                .state('addRoom.repository', {
                    url: '/repository',
                    templateUrl: 'partials/addRoom/repository.html',
                    controller: 'AddRepositoryRoomCtrl'
                })
                .state('addRoom.channel', {
                    url: '/channel',
                    templateUrl: 'partials/addRoom/channel.html',
                    controller: 'AddChannelRoomCtrl'
                })
                .state('addRoom.oneToOne', {
                    url: '/oneToOne',
                    templateUrl: 'partials/addRoom/oneToOne.html',
                    controller: 'AddOneToOneRoomCtrl'
                })
                .state('rooms', {
                    url: '/rooms',
                    templateUrl: 'partials/rooms.html',
                    controller: 'RoomsCtrl'
                })
                .state('chat', {
                    url: '/chat',
                    templateUrl: 'partials/chat.html',
                    controller: 'ChatCtrl'
                });
        }
    }
}