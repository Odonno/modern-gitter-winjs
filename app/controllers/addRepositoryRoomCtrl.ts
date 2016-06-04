/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddRepositoryRoomScope extends ng.IScope {
        canJoin: boolean;
        selectedRepository: Models.Repository;
        repositories: Models.Repository[];
        repositoriesWithoutRoom: Models.Repository[];

        selectRepository(repository: Models.Repository): void;
        createRoom(): void;
    }

    export class AddRepositoryRoomCtrl {
        constructor($scope: IAddRepositoryRoomScope, $filter: ng.IFilterService, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
            // methods
            $scope.selectRepository = (repository: Models.Repository) => {
                $scope.selectedRepository = repository;
                $scope.canJoin = RoomsService.canJoin($scope.selectedRepository.uri);
            };

            $scope.createRoom = () => {
                RoomsService.createRoom($scope.selectedRepository.uri, room => {
                    let toastOptions: Services.IToastOptions = {
                        launch: `action=viewRoom&roomId=${room.id}`,
                        expirationTime: 5
                    };
                    ToastNotificationService.sendImageAndTextNotification(room.image, `The room ${room.name} has been successfully created`, toastOptions);
                    
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                });
            };

            // initialize controller
            ApiService.getRepositories(RoomsService.currentUser.id)
                .then(repositories => {
                    $scope.repositories = repositories;
                    $scope.$digest();
                });

            // watch events
            $scope.$watch('repositories', () => {
                $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
            }, true);
        }
    }
}