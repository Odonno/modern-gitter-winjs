/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LifecycleService {
        // properties
        public ontoast: { (action: string, data?: any): void; };

        constructor(FeatureToggleService: FeatureToggleService, LocalSettingsService: LocalSettingsService) {
            if (!FeatureToggleService.isWindowsApp()) {
                return;
            }

            WinJS.Application.onactivated = (args) => {
                if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
                    if (args.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                        // TODO : this application has been newly launched, initialize your application here
                    } else {
                        // TODO : this application was suspended and then terminated
                    }
                }

                if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.toastNotification) {
                    // retrieve saved query inside argument data
                    let toastQuery = args.detail.argument;

                    // retrieve action and other values in toast query
                    let action = this.getQueryValue(toastQuery, 'action');

                    if (action == 'viewRoom') {
                        // TODO : remove navigation history
                        LocalSettingsService.remove('lastPage');
                        
                        let roomId = this.getQueryValue(toastQuery, 'roomId');

                        // TODO : navigate to room
                        if (this.ontoast) {
                            this.ontoast(action, { roomId: roomId });
                        }
                    }
                }

                args.setPromise(WinJS.UI.processAll());
            };

            WinJS.Application.oncheckpoint = (args) => {
                // TODO : this application is about to be suspended, save any state that needs to persist across suspensions here
            };

            WinJS.Application.start();
        }

        // private methods
        private getQueryValue(query: string, key: string) {
            let vars: string[] = query.split('&');
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split('=');
                if (pair[0] == key) {
                    return pair[1];
                }
            }
        }
    }
}