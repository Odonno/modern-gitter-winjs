angular.module('modern-gitter')
    .controller('AddRoomCtrl', function ($scope, $filter, ApiService) {
        // properties
        $scope.owners = [];
        $scope.channel = {};
        
        // methods
        $scope.selectOwner = function (owner) {
            $scope.channel.owner = owner;  
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            $scope.owners.push(user);

            ApiService.getRepositories(user.id).then(function (repositories) {
                $scope.repositories = repositories;
            });
        });
        
        // watch events
        $scope.$watch('repositories', function () {
            $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
        }, true);
    });