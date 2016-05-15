/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddOneToOneRoomScope extends ng.IScope {
        username: string;
        users: Models.User[];
        selection: number[];
        
        createRoom(): void;
    }

    export class AddOneToOneRoomCtrl {
        constructor($scope: IAddOneToOneRoomScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // properties
            $scope.username = '';
            $scope.users = [];
            $scope.selection = [];

            // methods
            $scope.createRoom = () => {
                var selectedUser = $scope.users[$scope.selection[0]];
                RoomsService.createRoom(selectedUser.username, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name, 'action=viewRoom&roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };

            // watch events
            $scope.$watch('username', () => {
                if ($scope.username && $scope.username.length > 0) {
                    ApiService.searchUsers($scope.username, 50).then((users) => {
                        $scope.users = users;
                        $scope.$digest();
                    });
                }
            });
        }
    }
}