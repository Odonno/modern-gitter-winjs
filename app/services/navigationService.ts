/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class NavigationService {
        private _systemNavigationManager: any;

        constructor(private $rootScope: Configs.IAppRootScope, private $state: ng.ui.IStateService, private RoomsService: RoomsService, private FeatureToggleService: Services.FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this._systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
            }
        }

        public onnavigate(fromState: ng.ui.IState, fromParams: any, canGoBack: boolean = true) {
            this.$rootScope.previousState = fromState.name;

            // show or hide back button
            if (this.FeatureToggleService.isWindowsApp()) {
                if (canGoBack) {
                    this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
                } else {
                    this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                }
            }

            // add current state to history
            this.$rootScope.states.push({
                state: this.$rootScope.previousState,
                params: fromParams
            });
        }

        public goBack() {
            // can't go back if we are at the root page
            if (this.$rootScope.states.length === 0) {
                return;
            }

            // is back active
            this.$rootScope.isBack = true;

            // retrieve and remove last state from history
            let previous = this.$rootScope.states.pop();

            // remove chat page from navigation stack if there is no current room now
            while (previous.state === 'chat' && !this.RoomsService.currentRoom) {
                previous = this.$rootScope.states.pop();
            }

            // go back to previous page
            this.$state.go(previous.state, previous.params);

            if (this.FeatureToggleService.isWindowsApp()) {
                if (this.$rootScope.states.length === 0) {
                    this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                }
            }
        }
    }
}