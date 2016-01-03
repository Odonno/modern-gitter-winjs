/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        public isWindowsApp = () => {
            try {
                if (Windows) {
                    return true;
                }
            }
            catch (e) {
                return false;
            }
        };
    }
}