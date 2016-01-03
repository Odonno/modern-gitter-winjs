/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class HomeCtrl {
        private scope: any;

        constructor($scope, RoomsService) {
            this.scope = $scope;

            var currentPackage = Windows.ApplicationModel.Package.current;
        
            // properties
            this.scope.appVersion = currentPackage.id.version;
        }
    }
}