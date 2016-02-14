/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ToastNotificationService {
        private toastNotifier: any;

        constructor(private FeatureToggleService: Application.Services.FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
            }
        }
        
        // private methods
        private sendGenericToast(toast: string) {
            // generate XML from toast content
            var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
            toastXml.loadXml(toast);

            // create toast notification and display it
            var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toastNotification);
        }

        // public methods
        public sendTextNotification(text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text></text>'
                    + '<text>' + text + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                toast = toast.replace(/&/g, '&amp;');
                this.sendGenericToast(toast);
            } else {
                var template = Windows.UI.Notifications.ToastTemplateType.toastText01;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));

                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendTitleAndTextNotification(title: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text>' + title + '</text>'
                    + '<text>' + text + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                toast = toast.replace(/&/g, '&amp;');
                this.sendGenericToast(toast);
            } else {
                var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));

                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendImageAndTextNotification(image: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text></text>'
                    + '<text>' + text + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                toast = toast.replace(/&/g, '&amp;');
                this.sendGenericToast(toast);
            } else {
                var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText01;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                var toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);

                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));

                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendImageTitleAndTextNotification(image: string, title: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text>' + title + '</text>'
                    + '<text>' + text + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                toast = toast.replace(/&/g, '&amp;');
                this.sendGenericToast(toast);
            } else {
                var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                var toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);

                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));

                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }
    }
}