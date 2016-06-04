/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export interface IToastOptions {
        tag?: string;
        group?: string;
        expirationTime?: number;
        launch: string;
        duration?: string;
        activationType?: string;
        scenario?: string;
    }

    export interface IReplyOptions {
        id: string;
        type: string;
        content: string;
        arguments: string;
        defaultInput: string;
        placeHolderContent: string;
        image?: string;
        activationType: string;
    }

    export class ToastNotificationService {
        // properties
        private toastNotifier: Windows.UI.Notifications.ToastNotifier;

        constructor(private FeatureToggleService: FeatureToggleService) {
            if (this.FeatureToggleService.isWindowsApp()) {
                this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
            }
        }

        // private methods
        private encodeLaunchArg(launch: string): string {
            return launch.replace(/&/g, '&amp;');
        }

        private encodeTextNotification(text: string): string {
            return text.replace('<', '&lt;').replace('>', '&gt;');
        }

        private send(toast: string, args: IToastOptions): void {
            // generate XML from toast content
            let toastXml = new Windows.Data.Xml.Dom.XmlDocument();
            toastXml.loadXml(toast);

            // create toast notification and add properties to toast notification
            let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
            if (args) {
                if (args.tag) {
                    toastNotification.tag = args.tag;
                }
                if (args.group) {
                    toastNotification.group = args.group;
                }
                if (args.expirationTime) {
                    let expiration = new Date();
                    expiration.setSeconds(expiration.getSeconds() + args.expirationTime);
                    
                    toastNotification.expirationTime = expiration;
                }
            }

            // display notification
            this.toastNotifier.show(toastNotification);
        }

        // public methods
        public sendTextNotification(text: string, toastOptions?: IToastOptions) {
            let toastArgs = '';
            if (toastOptions) {
                toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
            }

            let toast = '<toast' + toastArgs + '>'
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<text></text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.send(toast, toastOptions);
        }

        public sendTitleAndTextNotification(title: string, text: string, toastOptions?: IToastOptions) {
            let toastArgs = '';
            if (toastOptions) {
                toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
            }

            let toast = '<toast' + toastArgs + '>'
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<text>' + this.encodeTextNotification(title) + '</text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.send(toast, toastOptions);
        }

        public sendImageAndTextNotification(image: string, text: string, toastOptions?: IToastOptions) {
            let toastArgs = '';
            if (toastOptions) {
                toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
            }

            let toast = '<toast' + toastArgs + '>'
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<image placement="appLogoOverride" src="' + image + '" />'
                + '<text></text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.send(toast, toastOptions);
        }

        public sendImageTitleAndTextNotification(image: string, title: string, text: string, toastOptions?: IToastOptions) {
            let toastArgs = '';
            if (toastOptions) {
                toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
            }

            let toast = '<toast' + toastArgs + '>'
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<image placement="appLogoOverride" src="' + image + '" />'
                + '<text>' + this.encodeTextNotification(title) + '</text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '</toast>';

            this.send(toast, toastOptions);
        }

        public sendImageTitleAndTextNotificationWithReply(image: string, title: string, text: string, replyOptions: IReplyOptions, toastOptions?: IToastOptions) {
            let toastArgs = '';
            if (toastOptions) {
                toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
            }

            let toast = '<toast' + toastArgs + '>'
                + '<visual>'
                + '<binding template="ToastGeneric">'
                + '<image placement="appLogoOverride" src="' + image + '" />'
                + '<text>' + this.encodeTextNotification(title) + '</text>'
                + '<text>' + this.encodeTextNotification(text) + '</text>'
                + '</binding>'
                + '</visual>'
                + '<actions>'
                + '<input id="' + replyOptions.id + '" type="' + replyOptions.type + '" placeHolderContent="' + replyOptions.placeHolderContent + '" defaultInput="' + this.encodeTextNotification(replyOptions.defaultInput) + '" />'
                + '<action content="' + replyOptions.content + '" imageUri="' + replyOptions.image + '" hint-inputId="' + replyOptions.id + '" activationType="' + replyOptions.activationType + '" arguments="' + this.encodeLaunchArg(replyOptions.arguments) + '" />'
                + '</actions>'
                + '</toast>';

            this.send(toast, toastOptions);
        }
    }
}