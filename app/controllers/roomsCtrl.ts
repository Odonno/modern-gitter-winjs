/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IRoomsScope extends ng.IScope {
        rooms: Models.Room[];
        filteredRooms: Models.Room[];
        search: string;

        selectRoom(room: Models.Room): void;
    }

    export class RoomsCtrl {
        constructor($scope: IRoomsScope, $filter: ng.IFilterService, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, LocalSettingsService: Services.LocalSettingsService, FeatureToggleService: Services.FeatureToggleService) {
            // update local storage
            LocalSettingsService.setValue('lastPage', 'rooms');

            // properties
            $scope.rooms = RoomsService.rooms;

            // methods
            $scope.selectRoom = (room: Models.Room) => {
                RoomsService.selectRoom(room);
                $state.go('chat');
            };

            // watch events
            $scope.$watchGroup(['rooms', 'search'], () => {
                $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
                $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
            });
        }
    }
}