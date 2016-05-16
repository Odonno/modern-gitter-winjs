/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LifecycleService {
        // properties
        private app;
        private activation;
        public ontoast: { (action: string, data?: any): void; };

        constructor(FeatureToggleService: FeatureToggleService) {
            if (!FeatureToggleService.isWindowsApp()) {
                return;
            }
            
            this.app = WinJS.Application;
            this.activation = Windows.ApplicationModel.Activation;
            
            this.app.onactivated = function(args) {
                if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
                    if (args.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                        // TODO : this application has been newly launched, initialize your application here
                    } else {
                        // TODO : this application was suspended and then terminated
                    }

                    args.setPromise(WinJS.UI.processAll());
                }

                if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.toastNotification) {
                    // retrieve saved query inside argument data
                    let toastQuery = args.detail.argument;

                    // retrieve action and other values in toast query
                    let action = this.getQueryValue(toastQuery, 'action');

                    if (action == 'viewRoom') {
                        let roomId = this.getQueryValue(toastQuery, 'roomId');
                        
                        // TODO : navigate to room
                        if (this.ontoast) {
                            this.ontoast(action, { room: roomId });
                        }
                    }
                }
            };

            this.app.oncheckpoint = function(args) {
                // TODO : this application is about to be suspended, save any state that needs to persist across suspensions here
            };

            this.app.start();
        }
        
        // private methods
        private getQueryValue(query, key) {
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