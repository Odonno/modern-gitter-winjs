/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface ISplashscreenScope extends ng.IScope {        
    }
    
    export class SplashscreenCtrl {
        constructor($scope: ISplashscreenScope) {
        }
    }
}