/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LocalSettingsService {
        // properties
        private localSettings: Windows.Storage.ApplicationDataContainer;

        constructor(private FeatureToggleService: FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings = Windows.Storage.ApplicationData.current.localSettings;
            } else {
                // TODO : use HTML5 local storage
            }
        }

        // methods
        public containsValue(key: string): boolean {
             if (this.FeatureToggleService.isWindowsApp()) {
                return this.localSettings.values.hasKey(key);
            } else {
                // TODO
            }
        }
        
        public getValue(key: string): any {
            if (this.FeatureToggleService.isWindowsApp()) {
                return this.localSettings.values[key];
            } else {
                // TODO
            }
        };

        public setValue(key: string, value: any): void {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings.values[key] = value;
            } else {
                // TODO
            }
        };

        public deleteValue(key: string): void {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.localSettings.values.remove(key);
            } else {
                // TODO
            }
        };
    }
}