angular.module('modern-gitter')
    .controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService) {
        $scope.rooms = RoomsService.rooms;

        // methods
        $scope.selectRoom = function (room) {
            RoomsService.selectRoom(room);
            $state.go('room');
        };

        // watch events
        $scope.$watch('rooms', function () {
            $scope.orderedRooms = $filter('orderBy')($scope.rooms, ['favourite', '-unreadItems', '-lastAccessTime']);
        });
    });