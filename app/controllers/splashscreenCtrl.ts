/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class SplashscreenCtrl {
        private scope: any;

        constructor($scope, $state, RoomsService: Application.Services.RoomsService) {
            this.scope = $scope;
            
            // initialize controller
            RoomsService.initialize(function() {
                // TODO : navigate to previous visited room if there is one
                // TODO : navigate to rooms list if there is no previous room
                // TODO : or navigate to home page if it's the first time
                $state.go('home');
            });
        }
    }
}