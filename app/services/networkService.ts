/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class NetworkService {
        private networkInformation = Windows.Networking.Connectivity.NetworkInformation;
        public internetAvailable: boolean;

        constructor() {
            this.currentStatus();
        }

        public currentStatus() {
            var internetConnectionProfile = this.networkInformation.getInternetConnectionProfile();
            var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
            this.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
            return this.internetAvailable;
        }

        public statusChanged(callback) {
            this.networkInformation.onnetworkstatuschanged = function(ev) {
                callback(this.currentStatus());
            };
        };
    }
}