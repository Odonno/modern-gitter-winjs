﻿/// <reference path="../typings/tsd.d.ts" />

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

class UnreadMentionsNotificationsTask extends BackgroundTask {
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

                // retrieve current user
                this.getCurrentUser()
                    .then(success => {
                        let currentUser: User = JSON.parse(success.response)[0];

                        // add notifications for unread mentions
                        let i = 0;
                        let recursiveCreateNotification = () => {
                            if (i >= notifyableRooms.length) {
                                this.onclose("Succeeded");
                                return;
                            }

                            // show notifications (if possible)
                            this.createNotification(currentUser.id, notifyableRooms[i], () => {
                                i++;
                                recursiveCreateNotification();
                            });
                        };
                        recursiveCreateNotification();
                    });
            });
    }

    // private methods
    private isEnabled(): boolean {
        if (this.settings.values.hasKey('isUnreadMentionsNotificationsEnabled')) {
            return this.settings.values['isUnreadMentionsNotificationsEnabled'];
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
        });
    }

    private getCurrentUser() {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/user",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    }

    private getUnreadItems(userId: string, roomId: string) {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/user/" + userId + "/rooms/" + roomId + "/unreadItems",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        })
    }

    private getMessages(roomId: string, messageId: string) {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/rooms/" + roomId + "/chatMessages/" + messageId,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        })
    }

    private createNotification(userId: string, room: Room, onroomnotified: { (): void }) {
        // compute room image
        if (room.user) {
            room.image = room.user.avatarUrlMedium;
        } else {
            room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
        }

        this.getUnreadItems(userId, room.id)
            .then(success => {
                // retrieve id of messages that contains a mention
                let mentionsId = JSON.parse(success.response).mention;

                // Retrieve each message that contains mentions
                let i = 0;
                let recursiveCreateNotificationOfMessage = () => {
                    if (i >= mentionsId.length) {
                        onroomnotified();
                        return;
                    }

                    // show notifications (if possible)
                    this.createNotificationOfMessage(room, mentionsId[i], () => {
                        i++;
                        recursiveCreateNotificationOfMessage();
                    });
                };
                recursiveCreateNotificationOfMessage();
            });
    }

    private createNotificationOfMessage(room: Room, messageId: string, onmentionnotified: { (): void }) {
        this.getMessages(room.id, messageId)
            .then(success => {
                // retrieve message
                let message = JSON.parse(success.response);
                let id = room.id + "_mention_" + messageId;

                if (!this.settings.values[id]) {
                    // add ability to answer to the message directly inside notification
                    let replyOptions = {
                        args: 'action=reply&roomId=' + room.id,
                        text: '@' + message.fromUser.username + ' ',
                        image: 'assets/icons/send.png'
                    };

                    // show notifications (toast notifications)
                    this.sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, 'action=viewRoom&roomId=' + room.id);
                    this.settings.values[id] = true;
                }

                onmentionnotified();
            });
    }

    private encodeArgsNotification(args: string): string {
        return args.replace(/&/g, '&amp;');
    }

    private encodeTextNotification(text: string): string {
        return text.replace('<', '&lt;').replace('>', '&gt;');
    }

    private sendImageTitleAndTextNotificationWithReply(image: string, title: string, text: string, replyOptions: any, args: any) {
        // create toast content
        var toast = '<toast launch="' + this.encodeArgsNotification(args) + '">'
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

        // generate XML from toast content
        var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
        toastXml.loadXml(toast);

        // create toast notification and display it
        var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toastNotification);
    }
}

// import WinJS
importScripts("/dist/winjs/js/base.js");

// execute background task
let backgroundTask = new UnreadMentionsNotificationsTask();
backgroundTask.execute();