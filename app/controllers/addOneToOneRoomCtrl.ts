/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddOneToOneRoomScope extends ng.IScope {
        search: string;
        users: Models.User[];
        selectedUser: Models.User;

        selectUser(user: Models.User);
        createRoom(): void;
    }

    export class AddOneToOneRoomCtrl {
        constructor($scope: IAddOneToOneRoomScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // properties
            $scope.search = '';
            $scope.users = [];

            // methods
            $scope.selectUser = (user: Models.User) => {
                $scope.selectedUser = user;
            };

            $scope.createRoom = () => {
                RoomsService.createRoom($scope.selectedUser.username, room => {
                    let toastOptions: Services.IToastOptions = {
                        launch: `action=viewRoom&roomId=${room.id}`,
                        expirationTime: 5
                    };
                    ToastNotificationService.sendImageAndTextNotification(room.image, `You can now chat with ${room.name}`, toastOptions);
                    
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };

            // watch events
            $scope.$watch('search', () => {
                if ($scope.search && $scope.search.length > 0) {
                    ApiService.searchUsers($scope.search, 50)
                        .then(users => {
                            $scope.users = users;
                            $scope.$digest();
                        });
                }
            });
        }
    }
}