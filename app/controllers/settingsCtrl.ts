/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface ISettingsScope extends ng.IScope {
        isUnreadItemsNotificationsEnabled: boolean;
        isUnreadMentionsNotificationsEnabled: boolean;
        isNewMessageNotificationEnabled: boolean;

        saveSetting(property: string);
    }

    export class SettingsCtrl {
        constructor($scope: ISettingsScope, LocalSettingsService: Services.LocalSettingsService, FeatureToggleService: Services.FeatureToggleService) {
            // properties
            $scope.isUnreadItemsNotificationsEnabled = FeatureToggleService.isUnreadItemsNotificationsEnabled();
            $scope.isUnreadMentionsNotificationsEnabled = FeatureToggleService.isUnreadMentionsNotificationsEnabled();
            $scope.isNewMessageNotificationEnabled = FeatureToggleService.isNewMessageNotificationEnabled();

            // method
            $scope.saveSetting = (property: string) => {
                // save in local storage
                if (LocalSettingsService.containsValue(property)) {
                    let lastValue: boolean = LocalSettingsService.getValue(property);
                    LocalSettingsService.setValue(property, !lastValue);
                } else {
                    LocalSettingsService.setValue(property, !$scope[property]);
                }
            };
        }
    }
}