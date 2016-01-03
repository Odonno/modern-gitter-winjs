/// <reference path="../../typings/tsd.d.ts" />

angular.module('modern-gitter')
    .service('NetworkService', function () {
        var networkService = this;
        
        var networkInformation = Windows.Networking.Connectivity.NetworkInformation;

        networkService.currentStatus = function () {
            var internetConnectionProfile = networkInformation.getInternetConnectionProfile();
            var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
            networkService.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
            return networkService.internetAvailable;
        }

        networkService.statusChanged = function (callback) {
            networkInformation.onnetworkstatuschanged = function (ev) {
                callback(networkService.currentStatus());
            };
        };

        networkService.currentStatus();

        return networkService;
    });