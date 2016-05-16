/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IErrorScope extends ng.IScope {
        errorType: string;
    }
    
    export class ErrorCtrl {
        constructor($scope: IErrorScope, $state: ng.ui.IStateService) {
            // properties
            $scope.errorType = $state.params['errorType'];
        }
    }
}