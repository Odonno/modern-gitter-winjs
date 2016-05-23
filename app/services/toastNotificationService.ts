/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ToastNotificationService {
        private toastNotifier: any;

        constructor(private FeatureToggleService: FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
            }
        }

        // private methods
        private encodeArgsNotification(args: string): string {
            return args.replace(/&/g, '&amp;');
        }

        private encodeTextNotification(text: string): string {
            return text.replace('<', '&lt;').replace('>', '&gt;');
        }

        private sendGenericToast(toast: string): void {
            // generate XML from toast content
            let toastXml = new Windows.Data.Xml.Dom.XmlDocument();
            toastXml.loadXml(toast);

            // create toast notification and display it
            let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
            this.toastNotifier.show(toastNotification);
        }

        // public methods
        public sendTextNotification(text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text></text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                    
                this.sendGenericToast(toast);
            } else {
                let template = Windows.UI.Notifications.ToastTemplateType.toastText01;
                let toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                let toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));

                let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendTitleAndTextNotification(title: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                    
                this.sendGenericToast(toast);
            } else {
                let template = Windows.UI.Notifications.ToastTemplateType.toastText02;
                let toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                let toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));

                let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendImageAndTextNotification(image: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text></text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                    
                this.sendGenericToast(toast);
            } else {
                let template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText01;
                let toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                let toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);

                let toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));

                let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendImageTitleAndTextNotification(image: string, title: string, text: string, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                
                this.sendGenericToast(toast);
            } else {
                let template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
                let toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

                let toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);

                let toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));

                let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            }
        }

        public sendImageTitleAndTextNotificationWithReply(image: string, title: string, text: string, replyOptions: any, args?: string) {
            if (this.FeatureToggleService.isLaunchHandled()) {
                let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '<actions>'
                    + '<input id="message" type="text" placeHolderContent="Type a reply" defaultInput="' + this.encodeTextNotification(replyOptions.text) + '" />'
                    + '<action content="Send" imageUri="' + replyOptions.image + '" hint-inputId="message" activationType="background" arguments="' + this.encodeArgsNotification(replyOptions.args) + '" />'
                    + '</actions>'
                    + '</toast>';
                    
                this.sendGenericToast(toast);
            }
        }
    }
}