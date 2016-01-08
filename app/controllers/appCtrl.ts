/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AppCtrl {
        private scope: any;

        constructor($scope) {
            this.scope = $scope;
            
            // properties
            
            // methods
            $scope.closeSplitViewToggle = () => {
                this.scope.splitViewWinControl.closePane();
            };
        }
    }
}