/// <reference path="../../typings/tsd.d.ts" />

module Application.Configs {
    export class RoutingConfig {
        constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
            $urlRouterProvider.otherwise('/home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                })
                .state('addRoom', {
                    url: '/addRoom',
                    views: {
                        '': {
                            templateUrl: 'partials/addRoom.html',
                            controller: 'AddRoomCtrl'
                        },
                        'existing@addRoom': {
                            templateUrl: 'partials/existing.html',
                            controller: 'AddExistingRoomCtrl'
                        },
                        'repository@addRoom': {
                            templateUrl: 'partials/repository.html',
                            controller: 'AddRepositoryRoomCtrl'
                        },
                        'channel@addRoom': {
                            templateUrl: 'partials/channel.html',
                            controller: 'AddChannelRoomCtrl'
                        },
                        'oneToOne@addRoom': {
                            templateUrl: 'partials/oneToOne.html',
                            controller: 'AddOneToOneRoomCtrl'
                        }
                    }
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
                });
        }
    }
}