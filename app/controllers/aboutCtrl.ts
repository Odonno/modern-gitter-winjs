/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAboutScope extends ng.IScope {
        appVersion: string;
    }
    
    export class AboutCtrl {
        constructor($scope: IAboutScope, FeatureToggleService: Services.FeatureToggleService) {
            // properties
            if (FeatureToggleService.isWindowsApp()) {
                let currentPackage = Windows.ApplicationModel.Package.current;
                let packageVersion = currentPackage.id.version;

                $scope.appVersion = packageVersion.major + '.' + packageVersion.minor + '.' + packageVersion.build;
            } else {
                $scope.appVersion = 'web';
            }
        }
    }
}