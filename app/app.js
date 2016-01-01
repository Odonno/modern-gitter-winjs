angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl',
            })
            .state('rooms', {
                url: '/rooms',
                templateUrl: 'partials/rooms.html',
                controller: 'RoomsCtrl',
            })
            .state('room', {
                url: '/room',
                templateUrl: 'partials/room.html',
                controller: 'RoomCtrl',
            });
    });