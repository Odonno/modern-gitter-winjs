/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AddRepositoryRoomCtrl {
        private scope: any;

        constructor($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
            this.scope = $scope;
            
            // properties
            this.scope.selection = [];
        
            // methods
            this.scope.createRoom = () => {
                var repository = this.scope.repositoriesWithoutRoom[this.scope.selection[0]];
                RoomsService.createRoom(repository.uri, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created');
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };
        
            // initialize controller
            ApiService.getCurrentUser().then((user) => {
                ApiService.getRepositories(user.id).then((repositories) => {
                    this.scope.repositories = repositories;
                });
            });
        
            // watch events
            this.scope.$watch('repositories', () => {
                this.scope.repositoriesWithoutRoom = $filter('filter')(this.scope.repositories, { exists: false });

                setTimeout(() => {
                    this.scope.repositoriesWinControl.forceLayout();
                }, 500);
            }, true);
        }
    }
}