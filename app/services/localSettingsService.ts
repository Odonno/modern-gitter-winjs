/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class LocalSettingsService {
        // properties
        private localSettings = Windows.Storage.ApplicationData.current.localSettings;
        
        // methods
        public getValue = (key: string) => {
            return this.localSettings.values[key];
        };

        public setValue = (key: string, value: any) => {
            this.localSettings.values[key] = value;
        };

        public deleteValue = (key: string) => {
            this.localSettings.values.remove(key);
        };
    }
}