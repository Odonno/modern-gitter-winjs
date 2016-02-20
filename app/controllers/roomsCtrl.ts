/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class RoomsCtrl {
        private scope: any;

        constructor($scope, $filter, $state, RoomsService: Application.Services.RoomsService, LocalSettingsService: Application.Services.LocalSettingsService, FeatureToggleService: Application.Services.FeatureToggleService) {
            this.scope = $scope;
            
            // update local storage
            LocalSettingsService.setValue('lastPage', 'rooms');
            
            // properties
            this.scope.rooms = RoomsService.rooms;

            // methods
            this.scope.selectRoom = (room) => {
                RoomsService.selectRoom(room);
                $state.go('room');
            };

            // watch events
            this.scope.$watchGroup(['rooms', 'search'], () => {
                this.scope.filteredRooms = $filter('filter')(this.scope.rooms, { name: this.scope.search });
                this.scope.filteredRooms = $filter('orderBy')(this.scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
            });
        }
    }
}