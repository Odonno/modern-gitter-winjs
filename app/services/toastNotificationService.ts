/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ToastNotificationService {
        private toastNotifier: any;

        constructor(FeatureToggleService: Application.Services.FeatureToggleService) {
            if (FeatureToggleService.isWindowsApp()) {
                this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
            }
        }

        public sendTextNotification(text: string) {
            var template = Windows.UI.Notifications.ToastTemplateType.toastText01;
            var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendTitleAndTextNotification(title: string, text: string) {
            var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
            var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendImageAndTextNotification(image: string, text: string) {
            var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText01;
            var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendImageTitleAndTextNotification(image: string, title: string, text: string) {
            var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
            var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };
    }
}