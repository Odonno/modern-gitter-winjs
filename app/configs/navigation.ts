/// <reference path="../../typings/tsd.d.ts" />

module Application.Configs {
    export class NavigationConfig {
        constructor($rootScope, $state, RoomsService: Application.Services.RoomsService, FeatureToggleService: Application.Services.FeatureToggleService) {
            var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
            $rootScope.states = [];
            $rootScope.previousState;
            $rootScope.currentState;
            $rootScope.isBack = false;

            $rootScope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {
                $rootScope.currentState = to.name;

                // remove navigation stack if we are before the home page (start app / splashscreen)
                if (!from.name || from.name === 'splashscreen') {
                    return;
                }

                // navigate to error page when there is no selected room
                if (to.name === 'room' && !RoomsService.currentRoom) {
                    $state.go('error');
                }
                if (to.name === 'error') {
                    return;
                }

                if ($rootScope.isBack) {
                    $rootScope.isBack = false;
                } else {
                    $rootScope.previousState = from.name;
                    systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            
                    // add current state to history
                    $rootScope.states.push({
                        state: $rootScope.previousState,
                        params: fromParams
                    });
                }
            });

            systemNavigationManager.onbackrequested = (args) => {
                if ($rootScope.states.length > 0) {
                    // is back active
                    $rootScope.isBack = true;
                    
                    // retrieve and remove last state from history
                    var previous = $rootScope.states.pop();
            
                    // remove error page from navigation stack if there is a current room now
                    while (previous.state === 'error' && RoomsService.currentRoom) {
                        previous = $rootScope.states.pop();
                    }

                    $rootScope.previousState = previous.state;
            
                    // go back to previous page
                    $state.go(previous.state, previous.params);

                    if ($rootScope.states.length === 0) {
                        systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                    }

                    args.handled = true;
                } else {
                    systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                }
            };
        }
    }
}