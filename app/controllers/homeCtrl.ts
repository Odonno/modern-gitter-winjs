/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class HomeCtrl {
        private scope: any;

        constructor($scope, RoomsService, FeatureToggleService: Application.Services.FeatureToggleService) {
            this.scope = $scope;
            
            // properties
            if (FeatureToggleService.isWindowsApp()) {
                var currentPackage = Windows.ApplicationModel.Package.current;
                var packageVersion = currentPackage.id.version;

                this.scope.appVersion = packageVersion.major + '.' + packageVersion.minor + '.' + packageVersion.build;
            } else {
                this.scope.appVersion = 'web';
            }
        }
    }
}