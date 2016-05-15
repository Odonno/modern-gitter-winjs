/// <reference path="../../typings/tsd.d.ts" />

module Application.Configs {
    export class RoutingConfig {
        constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
            $urlRouterProvider.otherwise('/splashscreen');

            $stateProvider
                .state('error', {
                    url: '/error',
                    templateUrl: 'partials/error.html',
                    controller: 'ErrorCtrl'
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
                .state('addRoom', {
                    abstract: true,
                    url: '/addRoom',
                    templateUrl: 'partials/addRoom.html',
                    controller: 'AddRoomCtrl'
                })
                .state('addRoom.existing', {
                    url: '/existing',
                    templateUrl: 'partials/existing.html',
                    controller: 'AddExistingRoomCtrl'
                })
                .state('addRoom.repository', {
                    url: '/repository',
                    templateUrl: 'partials/repository.html',
                    controller: 'AddRepositoryRoomCtrl'
                })
                .state('addRoom.channel', {
                    url: '/channel',
                    templateUrl: 'partials/channel.html',
                    controller: 'AddChannelRoomCtrl'
                })
                .state('addRoom.oneToOne', {
                    url: '/oneToOne',
                    templateUrl: 'partials/oneToOne.html',
                    controller: 'AddOneToOneRoomCtrl'
                })
                .state('rooms', {
                    url: '/rooms',
                    templateUrl: 'partials/rooms.html',
                    controller: 'RoomsCtrl'
                })
                .state('room', {
                    url: '/room',
                    templateUrl: 'partials/room.html',
                    controller: 'RoomCtrl'
                })
                .state('chat', {
                    url: '/chat',
                    templateUrl: 'partials/chat.html',
                    controller: 'ChatCtrl'
                });
        }
    }
}