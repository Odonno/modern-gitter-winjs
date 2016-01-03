angular.module('modern-gitter')
    .service('ToastNotificationService', function () {
        var toastNotificationService = this;

        var notifications = Windows.UI.Notifications;
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();

        toastNotificationService.sendTextNotification = function (text) {
            var template = notifications.ToastTemplateType.toastText01;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        toastNotificationService.sendTitleAndTextNotification = function (title, text) {
            var template = notifications.ToastTemplateType.toastText02;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        toastNotificationService.sendImageAndTextNotification = function (image, text) {
            var template = notifications.ToastTemplateType.toastImageAndText01;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        toastNotificationService.sendImageTitleAndTextNotification = function (image, title, text) {
            var template = notifications.ToastTemplateType.toastImageAndText02;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        return toastNotificationService;
    });