/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddChannelRoomScope extends ng.IScope {
        owners: Models.Owner[];
        permissions: Models.PermissionChannel[];
        channel: Models.NewChannel;

        selectOwner(owner: Models.Owner): void;
        createRoom(): void;
    }

    export class AddChannelRoomCtrl {
        constructor($scope: IAddChannelRoomScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
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
            $scope.channel = new Models.NewChannel();

            // methods
            $scope.selectOwner = (owner) => {
                $scope.channel.owner = owner;
            };

            $scope.createRoom = () => {
                RoomsService.createChannel($scope.channel, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, `The channel ${room.name} has been successfully created`, { launch: `action=viewRoom&roomId=${room.id}` });
                    
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };

            // initialize controller
            $scope.owners.push({
                id: RoomsService.currentUser.id,
                name: RoomsService.currentUser.username,
                image: RoomsService.currentUser.avatarUrlSmall,
                org: false
            });

            ApiService.getOrganizations(RoomsService.currentUser.id)
                .then(orgs => {
                    for (let i = 0; i < orgs.length; i++) {
                        $scope.owners.push({
                            id: orgs[i].id,
                            name: orgs[i].name,
                            image: orgs[i].avatar_url,
                            org: true
                        });
                    }

                    $scope.$digest();
                });
        }
    }
}