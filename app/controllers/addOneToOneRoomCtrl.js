angular.module('modern-gitter')
    .controller('AddOneToOneRoomCtrl', function ($scope, ApiService) {
        // properties
        $scope.username = '';
        $scope.users = [];
        
        // watch events
        $scope.$watch('username', function () {
            if ($scope.username) {
                ApiService.searchUsers($scope.username, 50).then(function (users) {
                    $scope.users = users.results;

                    setTimeout(function () {
                        $scope.usersWinControl.forceLayout();
                    }, 500);
                });
            }
        });
    });