/// <reference path="../../typings/tsd.d.ts" />

module Application.Configs {
    export interface IAppRootScope extends ng.IRootScopeService {
        states: { state: ng.ui.IState, params: any }[];
        previousState: ng.ui.IState;
        currentState: ng.ui.IState;
        currentParams: any;
        isBack: boolean;

        onnetworkstatuschanged(networkStatus: boolean): void;
    }

    export class NavigationConfig {
        private _systemNavigationManager: any;

        constructor($rootScope: IAppRootScope, $state: ng.ui.IStateService, RoomsService: Services.RoomsService, NetworkService: Services.NetworkService, NavigationService: Services.NavigationService, FeatureToggleService: Services.FeatureToggleService) {
            // properties
            $rootScope.states = [];
            $rootScope.isBack = false;

            if (FeatureToggleService.isWindowsApp()) {
                this._systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
            }

            // handle network change
            NetworkService.statusChanged(networkStatus => {
                $rootScope.onnetworkstatuschanged(networkStatus);
            });

            // add an event when we navigate to another view
            $rootScope.$on('$stateChangeSuccess', (event: ng.IAngularEvent, to: ng.ui.IState, toParams, from: ng.ui.IState, fromParams) => {
                $rootScope.currentState = to.name;
                $rootScope.currentParams = toParams;

                $rootScope.onnetworkstatuschanged(NetworkService.internetAvailable);

                // remove navigation stack if we are before the home page (start app / splashscreen)
                if (!from.name || from.name === 'splashscreen') {
                    return;
                }

                if ($rootScope.isBack) {
                    $rootScope.isBack = false;
                    return;
                }
                
                NavigationService.onnavigate(from, fromParams, NetworkService.internetAvailable);
            });

            // add an event when we go back to a previous view
            if (FeatureToggleService.isWindowsApp()) {
                this._systemNavigationManager.onbackrequested = (args) => {
                    if ($rootScope.states.length > 0) {
                        NavigationService.goBack();
                        args.handled = true; // do not exit application
                    } else {
                        this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                    }
                };
            }

            // initialize controller
            $rootScope.onnetworkstatuschanged = (networkStatus: boolean) => {
                if (networkStatus) {
                    // switch back to a previous view if we are seeing an error view
                    if ($rootScope.currentState === 'error' && $rootScope.currentParams.errorType === 'network') {
                        NavigationService.goBack();
                    }
                } else {
                    // navigate to an error view if we are seeing a non-error view
                    if ($rootScope.currentState !== 'error') {
                        $state.go('error', { errorType: 'network' });
                    }
                }
            };
        }
    }
}