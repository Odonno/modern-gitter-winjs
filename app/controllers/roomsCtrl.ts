/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IRoomsScope extends ng.IScope {
        rooms: Models.Room[];
        filteredRooms: Models.Room[];
        search: string;

        refresh(): void;
        selectRoom(room: Models.Room): void;
    }

    export class RoomsCtrl {
        constructor($scope: IRoomsScope, $filter: ng.IFilterService, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, LocalSettingsService: Services.LocalSettingsService, FeatureToggleService: Services.FeatureToggleService) {
            // update local storage
            LocalSettingsService.set('lastPage', 'rooms');

            // properties
            $scope.rooms = RoomsService.rooms;

            // methods
            $scope.refresh = () => {
                RoomsService.refreshRooms();
                console.log('rooms refreshed');
            };

            $scope.selectRoom = (room: Models.Room) => {
                RoomsService.selectRoom(room);
                $state.go('chat');
            };

            // watch events
            $scope.$watchGroup(['rooms', 'search'], () => {
                $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
                $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
            });

            // initialize controller
            WinJS.UI.processAll().done(() => {
                // toolbar command loaded
                var searchInput = <HTMLInputElement>document.getElementById('searchInput');
                searchInput.onkeyup = () => {
                    $scope.search = searchInput.value;
                    $scope.$apply();
                };

                var cmdRefresh = document.getElementById('cmdRefresh');
                cmdRefresh.onclick = () => {
                    $scope.refresh();
                };
            });
        }
    }
}