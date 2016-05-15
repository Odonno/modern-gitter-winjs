/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAppScope extends ng.IScope {
        
    }

    export class AppCtrl {
        constructor($scope: IAppScope, $rootScope: ng.IRootScopeService, FeatureToggleService: Services.FeatureToggleService) {
            // detect navigation
            $rootScope.$on('$stateChangeSuccess', (event, to: ng.ui.IState, toParams, from: ng.ui.IState, fromParams) => {
                if (!from.name || to.name === 'splashscreen') {
                    // hide pane splitview
                    this.invertCssClass('win-splitview-pane', 'win-splitview-pane-hidden');
                } else {
                    // make visible pane splitview
                    this.invertCssClass('win-splitview-pane-hidden', 'win-splitview-pane');
                }
            });
        }

        private invertCssClass = (oldClass: string, newCLass: string) => {
            var elements = document.getElementsByClassName(oldClass);
            for (var i in elements) {
                if (elements.hasOwnProperty(i)) {
                    elements[i].className = newCLass;
                }
            }
        };
    }
}