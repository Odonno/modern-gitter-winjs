/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AppCtrl {
        private scope: any;

        constructor($scope, $rootScope) {
            this.scope = $scope;
            
            // properties
            
            // methods
            $scope.closeSplitViewToggle = () => {
                this.scope.splitViewWinControl.closePane();
            };
            
            // detect navigation
            $rootScope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {
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