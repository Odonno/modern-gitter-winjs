/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ToastNotificationService {
        private notifications = Windows.UI.Notifications;
        private toastNotifier = this.notifications.ToastNotificationManager.createToastNotifier();

        public sendTextNotification(text) {
            var template = this.notifications.ToastTemplateType.toastText01;
            var toastXml = this.notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new this.notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendTitleAndTextNotification(title, text) {
            var template = this.notifications.ToastTemplateType.toastText02;
            var toastXml = this.notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new this.notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendImageAndTextNotification(image, text) {
            var template = this.notifications.ToastTemplateType.toastImageAndText01;
            var toastXml = this.notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new this.notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };

        public sendImageTitleAndTextNotification(image, title, text) {
            var template = this.notifications.ToastTemplateType.toastImageAndText02;
            var toastXml = this.notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new this.notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toast);
        };
    }
}