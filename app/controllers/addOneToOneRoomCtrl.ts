/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AddOneToOneRoomCtrl {
        private scope: any;

        constructor($scope, $state, ApiService, RoomsService, ToastNotificationService) {
            this.scope = $scope;
            
            // properties
            this.scope.username = '';
            this.scope.users = [];
            this.scope.selection = [];
        
            // methods
            this.scope.createRoom = () => {
                var selectedUser = this.scope.users[this.scope.selection[0]];
                RoomsService.createRoom(selectedUser.username, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name, 'action=viewRoom&roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };
        
            // watch events
            this.scope.$watch('username', () => {
                if (this.scope.username && this.scope.username.length > 0) {
                    ApiService.searchUsers(this.scope.username, 50).then((users) => {
                        this.scope.users = users;

                        setTimeout(() => {
                            this.scope.usersWinControl.forceLayout();
                        }, 500);
                    });
                }
            });
        }
    }
}