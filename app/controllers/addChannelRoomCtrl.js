angular.module('modern-gitter')
    .controller('AddChannelRoomCtrl', function ($scope, ApiService) {
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
        });
    });