/// <reference path="../../typings/tsd.d.ts" />

angular.module('modern-gitter')
    .controller('HomeCtrl', function ($scope, RoomsService) {
        var currentPackage = Windows.ApplicationModel.Package.current;
        
        // properties
        $scope.appVersion = currentPackage.id.version;
    });