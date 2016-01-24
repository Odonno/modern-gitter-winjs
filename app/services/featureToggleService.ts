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
    }
}