/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class FeatureToggleService {
        public isWindowsApp = () => {
            return Windows !== undefined;
        };
    }
}