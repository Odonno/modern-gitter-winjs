/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        // properties
        private _localSettingsService: LocalSettingsService;

        constructor(private $injector: ng.auto.IInjectorService) {
        }

        // private methods
        private inject() {
            if (!this._localSettingsService) {
                this._localSettingsService = <LocalSettingsService>this.$injector.get('LocalSettingsService');
            }
        }

        // Deployment Toggles
        public isWindowsApp(): boolean {
            return (typeof Windows !== 'undefined');
        };

        public isDebugMode(): boolean {
            if (this.isWindowsApp()) {
                let thisPackage = Windows.ApplicationModel.Package.current;
                let installedPath = thisPackage.installedLocation.path;

                if (typeof installedPath === "string") {
                    if (installedPath.match(/\\debug\\appx$/i)) {
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }
        };

        public isNotificationBackgroundTasksEnabled(): boolean {
            return this.isWindowsApp();
        };

        // Permission Toggles

        // Runtime Toggles
        public useFeedbackHubApp(): boolean {
            if (this.isWindowsApp()) {
                return (Microsoft.Services.Store.Engagement.Feedback.IsSupported);
            } else {
                return false;
            }
        };

        public isRunningWindowsMobile(): boolean {
            if (this.isWindowsApp()) {
                return (Windows.System.Profile.AnalyticsInfo.versionInfo.deviceFamily === "Windows.Mobile");
            } else {
                return false;
            }
        };

        // Experiment Toggles
        public isLaunchHandled(): boolean {
            return true;
        };

        // Settings Toggles
        public isUnreadItemsNotificationsEnabled(): boolean {
            this.inject();

            if (this._localSettingsService.containsValue('isUnreadItemsNotificationsEnabled')) {
                return this._localSettingsService.getValue('isUnreadItemsNotificationsEnabled');
            } else {
                return true;
            }
        };

        public isUnreadMentionsNotificationsEnabled(): boolean {
            this.inject();

            if (this._localSettingsService.containsValue('isUnreadMentionsNotificationsEnabled')) {
                return this._localSettingsService.getValue('isUnreadMentionsNotificationsEnabled');
            } else {
                return true;
            }
        };

        public isNewMessageNotificationEnabled(): boolean {
            this.inject();

            if (this._localSettingsService.containsValue('isNewMessageNotificationEnabled')) {
                return this._localSettingsService.getValue('isNewMessageNotificationEnabled');
            } else {
                return true;
            }
        };
    }
}