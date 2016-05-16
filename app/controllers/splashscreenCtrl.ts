/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface ISplashscreenScope extends ng.IScope {        
    }
    
    export class SplashscreenCtrl {
        constructor($scope: ISplashscreenScope, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, LocalSettingsService: Services.LocalSettingsService, BackgroundTaskService: Services.BackgroundTaskService, FeatureToggleService: Services.FeatureToggleService) {
            // initialize controller
            RoomsService.initialize(() => {
                // retrieve local storage data
                let lastPage = LocalSettingsService.getValue('lastPage');
                let lastRoom = LocalSettingsService.getValue('lastRoom');

                if (lastPage === 'chat' && lastRoom) {
                    // navigate to previous visited room if there is one
                    RoomsService.onroomselected = () => {
                        $state.go('chat');
                    };
                        
                    // select the room in RoomsService
                    let room = RoomsService.getRoom(lastRoom);
                    RoomsService.selectRoom(room);
                } else if (lastPage === 'rooms') {
                    // navigate to rooms list if there is no previous room
                    $state.go('rooms');
                } else {
                    // or navigate to home page if it's the first time
                    $state.go('home');
                }

                if (FeatureToggleService.isNotificationBackgroundTasksEnabled()) {
                    // retrieve version saved of background task
                    let lastVersion = LocalSettingsService.getValue('backgroundTaskVersion');

                    if (!lastVersion || lastVersion !== BackgroundTaskService.currentVersion) {
                        // unregister existing background tasks
                        BackgroundTaskService.unregisterAll();
                        
                        // register newest version
                        BackgroundTaskService.registerAll();
                        
                        // save version in local storage
                        LocalSettingsService.setValue('backgroundTaskVersion', BackgroundTaskService.currentVersion);
                    }
                }
            });
        }
    }
}