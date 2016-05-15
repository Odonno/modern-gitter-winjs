/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddRepositoryRoomScope extends ng.IScope {
        selection: number[];
        repositories: Models.Repository[];
        repositoriesWithoutRoom: Models.Repository[];
        
        createRoom(): void;
    }

    export class AddRepositoryRoomCtrl {
        constructor($scope: IAddRepositoryRoomScope, $filter: ng.IFilterService, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // properties
            $scope.selection = [];

            // methods
            $scope.createRoom = () => {
                var repository = $scope.repositoriesWithoutRoom[$scope.selection[0]];
                RoomsService.createRoom(repository.uri, room => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created', 'action=viewRoom&roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };

            // initialize controller
            ApiService.getCurrentUser().then((user) => {
                ApiService.getRepositories(user.id).then(repositories => {
                    $scope.repositories = repositories;
                    $scope.$digest();
                });
            });

            // watch events
            $scope.$watch('repositories', () => {
                $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
            }, true);
        }
    }
}