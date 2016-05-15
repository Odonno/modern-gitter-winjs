/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class NetworkService {
        public internetAvailable: boolean;

        constructor(private FeatureToggleService: FeatureToggleService) {
            this.currentStatus();
        }

        private currentStatus() {
            if (this.FeatureToggleService.isWindowsApp()) {
                var internetConnectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
                var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
                this.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
                return this.internetAvailable;
            } else {
                return true;
            }
        }

        public statusChanged(callback) {
            if (this.FeatureToggleService.isWindowsApp()) {
                Windows.Networking.Connectivity.NetworkInformation.onnetworkstatuschanged = (ev) => {
                    callback(this.currentStatus());
                };
            }
        };
    }
}