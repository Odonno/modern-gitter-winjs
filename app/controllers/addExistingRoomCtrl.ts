/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AddExistingRoomCtrl {
        private scope: any;

        constructor($scope, $state, ApiService, RoomsService, ToastNotificationService) {
            this.scope = $scope;
            
            // properties
            this.scope.roomname = '';
            this.scope.existingRooms = [];
            this.scope.selection = [];
            
            // methods
            this.scope.createRoom = () => {
                var selectedRoom = this.scope.existingRooms[this.scope.selection[0]];
                RoomsService.createRoom(selectedRoom.uri, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name);
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };
            
            // watch events
            this.scope.$watch('roomname', () => {
                if (this.scope.roomname && this.scope.roomname.length > 0) {
                    ApiService.searchRooms(this.scope.roomname, 50).then((rooms) => {
                        this.scope.existingRooms = rooms;

                        for (var i = 0; i < this.scope.existingRooms.length; i++) {
                            // compute room image
                            if (this.scope.existingRooms[i].user) {
                                this.scope.existingRooms[i].image = this.scope.existingRooms[i].user.avatarUrlMedium;
                            } else {
                                this.scope.existingRooms[i].image = "https://avatars.githubusercontent.com/" + this.scope.existingRooms[i].name.split('/')[0];
                            }
                        }

                        setTimeout(() => {
                            this.scope.existingRoomsWinControl.forceLayout();
                        }, 500);
                    });
                }
            });
        }
    }
}