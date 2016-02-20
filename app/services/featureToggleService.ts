/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        // Deployment Toggles
        public isWindowsApp = () => {
            return (typeof Windows !== 'undefined');
        };

        public isDebugMode = () => {
            return (typeof Debug !== 'undefined');
        };
        
        // TODO : Permission Toggles

        // Experiment Toggles
        public isMyImageShown = () => {
            return false;
        };

        public isFirstPageLoadedByStorage = () => {
            return true;
        };

        public isSplitviewAppNameShowed = () => {
            return false;
        };

        public isNotificationBackgroundTasksEnabled = () => {
            return this.isWindowsApp();
        };

        public isLaunchHandled = () => {
            return true;
        };
    }
}