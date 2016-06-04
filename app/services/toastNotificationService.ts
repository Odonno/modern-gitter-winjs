/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ToastNotificationService {
        // properties
        private toastNotifier: Windows.UI.Notifications.ToastNotifier;

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
            let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<text></text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.sendGenericToast(toast);
        }

        public sendTitleAndTextNotification(title: string, text: string, args?: string) {
            let toast = (args ? '<toast launch="' + this.encodeArgsNotification(args) + '">' : '<toast>')
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<text>' + this.encodeTextNotification(title) + '</text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.sendGenericToast(toast);
        }

        public sendImageAndTextNotification(image: string, text: string, args?: string) {
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
        }

        public sendImageTitleAndTextNotification(image: string, title: string, text: string, args?: string) {
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
        }

        public sendImageTitleAndTextNotificationWithReply(image: string, title: string, text: string, replyOptions: any, args?: string) {
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