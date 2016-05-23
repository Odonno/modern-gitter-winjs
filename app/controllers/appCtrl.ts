/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAppScope extends ng.IScope {
        loggedIn: boolean;
        isSignOutHandled: boolean;

        tryLogin();
        logout(): void;
    }

    export class AppCtrl {
        constructor($scope: IAppScope, $rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, OAuthService: Services.OAuthService, LocalSettingsService: Services.LocalSettingsService, BackgroundTaskService: Services.BackgroundTaskService, FeatureToggleService: Services.FeatureToggleService) {
            // properties
            $scope.loggedIn = RoomsService.loggedIn;
            $scope.isSignOutHandled = FeatureToggleService.isSignOutHandled();
            
            // methods
            $scope.tryLogin = () => {
                RoomsService.logIn(() => {
                    // check if user is now logged in
                    $scope.loggedIn = RoomsService.loggedIn;

                    // retrieve local storage data
                    let lastPage = LocalSettingsService.get('lastPage');
                    let lastRoom = LocalSettingsService.get('lastRoom');

                    if (lastPage === 'chat' && lastRoom) {
                        // navigate to previous visited room if there is one
                        RoomsService.onroomselected = () => {
                            $state.go(lastPage);
                        };

                        // select the room in RoomsService
                        let room = RoomsService.getRoom(lastRoom);
                        RoomsService.selectRoom(room);
                    } else if (lastPage === 'rooms') {
                        // navigate to rooms list if there is no previous room
                        $state.go(lastPage);
                    } else {
                        // or navigate to home page if it's the first time
                        $state.go('home');
                    }
                });
            };

            $scope.logout = () => {
                if (FeatureToggleService.isSignOutHandled()) {
                    // update local storage
                    LocalSettingsService.remove('lastPage');
                    LocalSettingsService.remove('lastRoom');

                    // TODO : navigate to non-authenticated view
                    $state.go('home');

                    // disconnect user from current session
                    OAuthService.disconnect();
                    RoomsService.reset();
                    
                    // check if user is now logged in
                    $scope.loggedIn = RoomsService.loggedIn;
                    
                    console.log('Succesfully logged out');
                }
            };

            // initialize controller
            $scope.tryLogin();

            // upgrade to latest background tasks if there is newer version
            if (FeatureToggleService.isNotificationBackgroundTasksEnabled()) {
                // retrieve version saved of background task
                let lastVersion = LocalSettingsService.get('backgroundTaskVersion');

                if (!lastVersion || lastVersion !== BackgroundTaskService.currentVersion) {
                    // unregister existing background tasks
                    BackgroundTaskService.unregisterAll();

                    // register newest version
                    BackgroundTaskService.registerAll();

                    // save version in local storage
                    LocalSettingsService.set('backgroundTaskVersion', BackgroundTaskService.currentVersion);
                }
            }

            // detect navigation
            $rootScope.$on('$stateChangeSuccess', (event, to: ng.ui.IState, toParams, from: ng.ui.IState, fromParams) => {
                if (!from.name || to.name === 'splashscreen') {
                    // hide pane splitview
                    this.invertCssClass('win-splitview-pane', 'win-splitview-pane-hidden');
                } else {
                    // make visible pane splitview
                    this.invertCssClass('win-splitview-pane-hidden', 'win-splitview-pane');
                    
                    // close pane splitview if we are on mobile
                    if (FeatureToggleService.isRunningWindowsMobile()) {
                        var splitView = document.querySelector(".splitView").winControl;
                        splitView.paneOpened = false;
                    }
                }
            });
        }

        // private methods
        private invertCssClass = (oldClass: string, newCLass: string) => {
            let elements = document.getElementsByClassName(oldClass);
            for (let i in elements) {
                if (elements.hasOwnProperty(i)) {
                    elements[i].className = newCLass;
                }
            }
        };
    }
}