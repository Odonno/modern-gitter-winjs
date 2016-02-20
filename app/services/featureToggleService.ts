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
        
        public isNotificationBackgroundTasksEnabled = () => {
            return this.isWindowsApp();
        };
        
        // TODO : Permission Toggles

        // Experiment Toggles
        public isMyImageShown = () => {
            return false;
        };

        public isSplitviewAppNameShowed = () => {
            return false;
        };

        public isLaunchHandled = () => {
            return true;
        };
    }
}