angular.module('modern-gitter')
    .controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.owners = [];
        $scope.permissions = [
            {
                name: "Public",
                description: "Anyone in the world can join."
            },
            {
                name: "Private",
                description: "Only people added to the room can join."
            }
        ];
        $scope.channel = {};
        
        // methods
        $scope.selectOwner = function (owner) {
            $scope.channel.owner = owner;
        };

        $scope.createRoom = function () {
            RoomsService.createChannel($scope.channel, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'The channel ' + room.name + ' has been successfully created');
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            $scope.owners.push({
                id: user.id,
                name: user.username,
                image: user.avatarUrlSmall,
                org: false
            });

            ApiService.getOrganizations(user.id).then(function (orgs) {
                for (var i = 0; i < orgs.length; i++) {
                    $scope.owners.push({
                        id: orgs[i].id,
                        name: orgs[i].name,
                        image: orgs[i].avatar_url,
                        org: true
                    });
                }
            });
        });
    });