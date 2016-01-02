angular.module('modern-gitter')
    .controller('AddRepositoryRoomCtrl', function ($scope, $filter, ApiService) {
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            ApiService.getRepositories(user.id).then(function (repositories) {
                $scope.repositories = repositories;
            });
        });
        
        // watch events
        $scope.$watch('repositories', function () {
            $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
        }, true);
    });