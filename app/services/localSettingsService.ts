/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LocalSettingsService {
        // properties
        private localSettings;

        constructor(private FeatureToggleService: Application.Services.FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings = Windows.Storage.ApplicationData.current.localSettings
            } else {
                // TODO : use HTML5 local storage
            }
        }
        
        // methods
        public getValue = (key: string) => {
            if (this.FeatureToggleService.isWindowsApp()) {
                return this.localSettings.values[key];
            } else {
                // TODO
            }
        };

        public setValue = (key: string, value: any) => {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings.values[key] = value;
            } else {
                // TODO
            }
        };

        public deleteValue = (key: string) => {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings.values.remove(key);
            } else {
                // TODO
            }
        };
    }
}