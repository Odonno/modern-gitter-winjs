/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddSuggestedRoomScope extends ng.IScope {
        canJoin: boolean;
        selectedRepository: Models.Repository;
        suggestions: Models.Repository[];

        selectRepository(repository: Models.Repository): void;
        createRoom(): void;
    }

    export class AddSuggestedRoomCtrl {
        constructor($scope: IAddSuggestedRoomScope, $filter: ng.IFilterService, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, ToastNotificationService: Services.ToastNotificationService) {
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
            ApiService.getSuggestedRooms()
                .then(repositories => {
                    $scope.suggestions = repositories;
                    $scope.$digest();
                });
        }
    }
}