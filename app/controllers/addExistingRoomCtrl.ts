/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddExistingRoomScope extends ng.IScope {
        roomname: string;
        existingRooms: Models.Room[];
        selection: number[];
        
        createRoom(): void;
    }
    
    export class AddExistingRoomCtrl {
        constructor($scope: IAddExistingRoomScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // properties
            $scope.roomname = '';
            $scope.existingRooms = [];
            $scope.selection = [];
            
            // methods
            $scope.createRoom = () => {
                let selectedRoom = $scope.existingRooms[$scope.selection[0]];
                RoomsService.createRoom(selectedRoom.uri, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name, 'action=viewRoom&roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };
            
            // watch events
            $scope.$watch('roomname', () => {
                if ($scope.roomname && $scope.roomname.length > 0) {
                    ApiService.searchRooms($scope.roomname, 50).then((rooms) => {
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