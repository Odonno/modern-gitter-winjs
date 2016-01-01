angular.module('modern-gitter')
    .controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService) {
        $scope.rooms = RoomsService.rooms;

        // methods
        $scope.selectRoom = function (room) {
            RoomsService.selectRoom(room);
            $state.go('room');
        };

        // watch events
        $scope.$watchGroup(['rooms', 'search'], function () {
            $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
            $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
        });
    });