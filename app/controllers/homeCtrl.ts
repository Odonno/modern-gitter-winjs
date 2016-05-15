/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IHomeScope extends ng.IScope {
        chatWithUs(): void
    }
    
    export class HomeCtrl {
        constructor($scope: IHomeScope, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // methods
            $scope.chatWithUs = () => {
                var roomName = 'Odonno/Modern-Gitter';

                // go to existing room if we already joined it
                for (var i = 0; i < RoomsService.rooms.length; i++) {
                    if (RoomsService.rooms[i].name === roomName) {
                        RoomsService.selectRoom(RoomsService.rooms[i]);
                        $state.go('chat');
                        return;
                    }
                }
                
                // join the room
                RoomsService.createRoom(roomName, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name, 'action=viewRoom&roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };
        }
    }
}