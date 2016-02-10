/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AddChannelRoomCtrl {
        private scope: any;

        constructor($scope, $state, ApiService, RoomsService, ToastNotificationService) {
            this.scope = $scope;
            
            // properties
            this.scope.owners = [];
            this.scope.permissions = [
                {
                    name: "Public",
                    description: "Anyone in the world can join."
                },
                {
                    name: "Private",
                    description: "Only people added to the room can join."
                }
            ];
            this.scope.channel = {};
            
            // methods
            this.scope.selectOwner = (owner) => {
                this.scope.channel.owner = owner;
            };

            this.scope.createRoom = () => {
                RoomsService.createChannel(this.scope.channel, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'The channel ' + room.name + ' has been successfully created', 'action=viewRoom&amp;roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };
            
            // initialize controller
            ApiService.getCurrentUser().then((user) => {
                this.scope.owners.push({
                    id: user.id,
                    name: user.username,
                    image: user.avatarUrlSmall,
                    org: false
                });

                ApiService.getOrganizations(user.id).then((orgs) => {
                    for (var i = 0; i < orgs.length; i++) {
                        this.scope.owners.push({
                            id: orgs[i].id,
                            name: orgs[i].name,
                            image: orgs[i].avatar_url,
                            org: true
                        });
                    }
                });
            });
        }
    }
}