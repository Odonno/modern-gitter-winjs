/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LocalSettingsService {
        // properties
        private localSettings;

        constructor(FeatureToggleService: Application.Services.FeatureToggleService) {
            if (FeatureToggleService.isWindowsApp()) {
                this.localSettings = Windows.Storage.ApplicationData.current.localSettings
            } else {
                // TODO : use HTML5 local storage
            }
        }
        
        // methods
        public getValue = (key: string) => {
            if (FeatureToggleService.isWindowsApp()) {
                return this.localSettings.values[key];
            } else {
                // TODO
            }
        };

        public setValue = (key: string, value: any) => {
            if (FeatureToggleService.isWindowsApp()) {
                this.localSettings.values[key] = value;
            } else {
                // TODO
            }
        };

        public deleteValue = (key: string) => {
            if (FeatureToggleService.isWindowsApp()) {
                this.localSettings.values.remove(key);
            } else {
                // TODO
            }
        };
    }
}