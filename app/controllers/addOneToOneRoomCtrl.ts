/// <reference path="../../typings/tsd.d.ts" />

angular.module('modern-gitter')
    .controller('AddOneToOneRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.username = '';
        $scope.users = [];
        $scope.selection = [];
        
        // methods
        $scope.createRoom = function () {
            var selectedUser = $scope.users[$scope.selection[0]];
            RoomsService.createRoom(selectedUser.username, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name);
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // watch events
        $scope.$watch('username', function () {
            if ($scope.username && $scope.username.length > 0) {
                ApiService.searchUsers($scope.username, 50).then(function (users) {
                    $scope.users = users;

                    setTimeout(function () {
                        $scope.usersWinControl.forceLayout();
                    }, 500);
                });
            }
        });
    });