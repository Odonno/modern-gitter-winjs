/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        public isWindowsApp = () => {
            return (typeof Windows !== 'undefined');
        };

        public isDebugMode = () => {
            return (typeof Debug !== 'undefined');
        };

        public isMyImageShown = () => {
            return false;
        };

        public isErrorHandled = () => {
            return true;
        };

        public useWinjsListView = () => {
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