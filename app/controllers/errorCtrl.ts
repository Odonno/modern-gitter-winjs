/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IErrorScope extends ng.IScope {
    }
    
    export class ErrorCtrl {
        constructor($scope: IErrorScope) {
        }
    }
}