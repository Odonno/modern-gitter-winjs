/// <reference path="../typings/tsd.d.ts" />

interface IToastOptions {
    launch: string;
    duration?: string;
    activationType?: string;
    scenario?: string;
}

interface IReplyOptions {
    id: string;
    type: string;
    content: string;
    arguments: string;
    defaultInput: string;
    placeHolderContent: string;
    image?: string;
    activationType: string;
}

class User {
    public id: string;
    public username: string;
    public displayName: string;
    public url: string;
    public avatarUrlSmall: string;
    public avatarUrlMedium: string;
}

class Room {
    public id: string;
    public name: string;
    public topic: string;
    public uri: string;
    public oneToOne: boolean;

    /**
     * Other user in one to one room
     */
    public user: User;

    /**
     * All users in the room
     */
    public users: User[];

    public userCount: number;
    public unreadItems: number;
    public mentions: number;
    public lastAccessTime: Date;
    public favourite: number;
    public lurk: boolean;
    public url: string;
    public githubType: string;
    public tags: string[];

    private _image: string;
    /**
     * Image created based on room/user info
     */
    get image(): string {
        return this._image;
    }
    set image(value: string) {
        this._image = value;
    }
}

abstract class BackgroundTask {
    // properties
    protected cancel: boolean;
    protected cancelReason: any;
    protected backgroundTaskInstance: any;
    protected settings = Windows.Storage.ApplicationData.current.localSettings;

    constructor() {
        this.backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
        this.backgroundTaskInstance.addEventListener("canceled", this.oncanceled);
    }

    // public methods
    public abstract canExecute(): boolean;
    public abstract execute();

    // private methods (background task instance)
    protected oncanceled(cancelEventArg) {
        this.cancel = true;
        this.cancelReason = cancelEventArg;
    }

    protected onclose(reason: string) {
        // record information in LocalSettings to communicate with the app
        let key = this.backgroundTaskInstance.task.taskId.toString();
        this.settings.values[key] = reason;

        // background task must call close when it is done
        close();
    }

    // private methods (others)
    protected retrieveTokenFromVault(): string {
        let passwordVault = new Windows.Security.Credentials.PasswordVault();
        let storedToken;

        try {
            let credential = passwordVault.retrieve("OauthToken", "CurrentUser");
            storedToken = credential.password;
        } catch (e) {
            // no stored credentials
        }

        return storedToken;
    }
}

class UnreadItemsNotificationsTask extends BackgroundTask {
    // properties
    private token: string;

    // public methods
    public canExecute(): boolean {
        if (this.cancel) {
            this.onclose("Canceled");
            return false;
        }

        if (!this.isEnabled()) {
            this.onclose("Disabled");
            return false;
        }

        // you need to be authenticated first to use Gitter API
        this.token = this.retrieveTokenFromVault();

        if (!this.token) {
            this.onclose("Failed");
            return false;
        }

        return true;
    }

    public execute() {
        if (!this.canExecute()) {
            return;
        }

        // retrieve every room of current user
        this.getRooms()
            .then(success => {
                let rooms: Room[] = JSON.parse(success.response);

                // retrieve rooms that user want notifications
                let notifyableRooms: Room[] = [];
                for (let i = 0; i < rooms.length; i++) {
                    if (!rooms[i].lurk) {
                        notifyableRooms.push(rooms[i]);
                    }
                }

                // show notifications for unread messages (if possible)
                for (let i = 0; i < notifyableRooms.length; i++) {
                    this.createNotification(notifyableRooms[i]);
                }

                this.onclose("Succeeded");
            });
    }

    // private methods
    private isEnabled(): boolean {
        if (this.settings.values.hasKey('isUnreadItemsNotificationsEnabled')) {
            return this.settings.values['isUnreadItemsNotificationsEnabled'];
        } else {
            return true;
        }
    }

    private getRooms() {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/rooms",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        })
    }

    private createNotification(room: Room) {
        let id = room.name;

        // detect if there is no new notification to launch (no unread messages)
        if (this.settings.values[id]) {
            // reset notification id for the future
            if (room.unreadItems == 0) {
                this.settings.values.remove(id);
            }
            return;
        }

        if (room.unreadItems > 0) {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
            }

            // show notifications (toast notifications)
            this.sendImageTitleAndTextNotification(room.image, "New messages", `${room.name}: ${room.unreadItems} unread messages`, { launch: `action=viewRoom&roomId=${room.id}` });
            this.settings.values[id] = room.unreadItems;
        }
    }

    private encodeLaunchArg(launch: string): string {
        return launch.replace(/&/g, '&amp;');
    }

    private encodeImageArg(image: string): string {
        return image.replace(/&/g, '&amp;');
    }

    private encodeTextNotification(text: string): string {
        return text.replace('<', '&lt;').replace('>', '&gt;');
    }

    private sendImageTitleAndTextNotification(image: string, title: string, text: string, toastOptions?: IToastOptions) {
        // create toast content
        let toastArgs = '';
        if (toastOptions) {
            toastArgs += (toastOptions.launch ? ` launch="${this.encodeLaunchArg(toastOptions.launch)}"` : '')
        }

        let toast = '<toast' + toastArgs + '>'
            + '<visual>'
            + '<binding template="ToastGeneric">'
            + '<image placement="appLogoOverride" src="' + this.encodeImageArg(image) + '" />'
            + '<text>' + this.encodeTextNotification(title) + '</text>'
            + '<text>' + this.encodeTextNotification(text) + '</text>'
            + '</binding>'
            + '</visual>'
            + '</toast>';

        // generate XML from toast content
        let toastXml = new Windows.Data.Xml.Dom.XmlDocument();
        toastXml.loadXml(toast);

        // create toast notification and display it
        let toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
        let toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toastNotification);
    }
}

// import WinJS
importScripts("/dist/winjs/js/base.js");

// execute background task
let backgroundTask = new UnreadItemsNotificationsTask();
backgroundTask.execute();