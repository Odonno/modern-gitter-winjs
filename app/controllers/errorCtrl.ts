/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class ErrorCtrl {
        private scope: any;

        constructor($scope) {
            this.scope = $scope;
        }
    }
}