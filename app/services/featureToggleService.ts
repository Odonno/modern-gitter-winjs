/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        public isWindowsApp = () => {
            return (typeof Windows !== 'undefined');
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
    }
}