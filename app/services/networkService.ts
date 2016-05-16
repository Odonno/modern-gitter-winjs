/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class NetworkService {
        public internetAvailable: boolean;

        constructor(private FeatureToggleService: FeatureToggleService) {
            this.currentStatus();
        }

        private currentStatus() {
            if (this.FeatureToggleService.isWindowsApp()) {
                let internetConnectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();

                if (!internetConnectionProfile) {
                    this.internetAvailable = false;
                } else {
                    let networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
                    this.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
                }
            } else {
                this.internetAvailable = true;
            }

            return this.internetAvailable;
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