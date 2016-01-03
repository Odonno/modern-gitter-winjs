/// <reference path="../../typings/tsd.d.ts" />

angular.module('modern-gitter')
    .controller('AddRepositoryRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.selection = [];
        
        // methods
        $scope.createRoom = function () {
            var repository = $scope.repositoriesWithoutRoom[$scope.selection[0]];
            RoomsService.createRoom(repository.uri, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created');
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            ApiService.getRepositories(user.id).then(function (repositories) {
                $scope.repositories = repositories;
            });
        });
        
        // watch events
        $scope.$watch('repositories', function () {
            $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });

            setTimeout(function () {
                $scope.repositoriesWinControl.forceLayout();
            }, 500);
        }, true);
    });