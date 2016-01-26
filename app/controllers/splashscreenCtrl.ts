/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class SplashscreenCtrl {
        private scope: any;

        constructor($scope, $state, RoomsService: Application.Services.RoomsService, LocalSettingsService: Application.Services.LocalSettingsService, FeatureToggleService: Application.Services.FeatureToggleService) {
            this.scope = $scope;
            
            // initialize controller
            RoomsService.initialize(function() {
                if (FeatureToggleService.isFirstPageLoadedByStorage()) {
                    // retrieve local storage data
                    var lastPage = LocalSettingsService.getValue('lastPage');
                    var lastRoom = LocalSettingsService.getValue('lastRoom');

                    if (lastPage === 'room' && lastRoom) {
                        // navigate to previous visited room if there is one
                        RoomsService.onroomselected = () => {
                            $state.go('room');
                        };
                        
                        // select the room in RoomsService
                        var room = RoomsService.getRoom(lastRoom);
                        RoomsService.selectRoom(room);                        
                    } else if (lastPage === 'rooms') {
                        // navigate to rooms list if there is no previous room
                        $state.go('rooms');
                    } else {
                        // or navigate to home page if it's the first time
                        $state.go('home');
                    }
                } else {
                    $state.go('home');
                }
            });
        }
    }
}