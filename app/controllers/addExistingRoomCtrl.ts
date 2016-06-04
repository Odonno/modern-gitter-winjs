/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddExistingRoomScope extends ng.IScope {
        canJoin: boolean;
        search: string;
        existingRooms: Models.Room[];
        selectedRoom: Models.Room;

        selectRoom(room: Models.Room): void;
        joinRoom(): void;
    }

    export class AddExistingRoomCtrl {
        constructor($scope: IAddExistingRoomScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // properties
            $scope.search = '';
            $scope.existingRooms = [];

            // methods
            $scope.selectRoom = (room: Models.Room) => {
                $scope.selectedRoom = room;
                $scope.canJoin = RoomsService.canJoin($scope.selectedRoom.name);
            }

            $scope.joinRoom = () => {
                RoomsService.createRoom($scope.selectedRoom.uri, room => {
                    let toastOptions: Services.IToastOptions = {
                        launch: `action=viewRoom&roomId=${room.id}`,
                        expirationTime: 5
                    };
                    ToastNotificationService.sendImageAndTextNotification(room.image, `You joined the room ${room.name}`, toastOptions);
                    
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };

            // watch events
            $scope.$watch('search', () => {
                if ($scope.search && $scope.search.length > 0) {
                    ApiService.searchRooms($scope.search, 50)
                        .then(rooms => {
                            $scope.existingRooms = rooms;

                            for (let i = 0; i < $scope.existingRooms.length; i++) {
                                // compute room image
                                if ($scope.existingRooms[i].user) {
                                    $scope.existingRooms[i].image = $scope.existingRooms[i].user.avatarUrlMedium;
                                } else {
                                    $scope.existingRooms[i].image = "https://avatars.githubusercontent.com/" + $scope.existingRooms[i].name.split('/')[0];
                                }
                            }

                            $scope.$digest();
                        });
                }
            });
        }
    }
}