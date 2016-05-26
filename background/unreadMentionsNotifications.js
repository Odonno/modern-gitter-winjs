var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var User = (function () {
    function User() {
    }
    return User;
}());
var Room = (function () {
    function Room() {
    }
    Object.defineProperty(Room.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (value) {
            this._image = value;
        },
        enumerable: true,
        configurable: true
    });
    return Room;
}());
var BackgroundTask = (function () {
    function BackgroundTask() {
        this.settings = Windows.Storage.ApplicationData.current.localSettings;
        this.backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
        this.backgroundTaskInstance.addEventListener("canceled", this.oncanceled);
    }
    BackgroundTask.prototype.oncanceled = function (cancelEventArg) {
        this.cancel = true;
        this.cancelReason = cancelEventArg;
    };
    BackgroundTask.prototype.onclose = function (reason) {
        var key = this.backgroundTaskInstance.task.taskId.toString();
        this.settings.values[key] = reason;
        close();
    };
    BackgroundTask.prototype.retrieveTokenFromVault = function () {
        var passwordVault = new Windows.Security.Credentials.PasswordVault();
        var storedToken;
        try {
            var credential = passwordVault.retrieve("OauthToken", "CurrentUser");
            storedToken = credential.password;
        }
        catch (e) {
        }
        return storedToken;
    };
    return BackgroundTask;
}());
var UnreadMentionsNotificationsTask = (function (_super) {
    __extends(UnreadMentionsNotificationsTask, _super);
    function UnreadMentionsNotificationsTask() {
        _super.apply(this, arguments);
    }
    UnreadMentionsNotificationsTask.prototype.canExecute = function () {
        if (this.cancel) {
            this.onclose("Canceled");
            return false;
        }
        if (!this.isEnabled()) {
            this.onclose("Disabled");
            return false;
        }
        this.token = this.retrieveTokenFromVault();
        if (!this.token) {
            this.onclose("Failed");
            return false;
        }
        return true;
    };
    UnreadMentionsNotificationsTask.prototype.execute = function () {
        var _this = this;
        this.getRooms()
            .then(function (success) {
            var rooms = JSON.parse(success.response);
            var notifyableRooms = [];
            for (var i = 0; i < rooms.length; i++) {
                if (!rooms[i].lurk) {
                    notifyableRooms.push(rooms[i]);
                }
            }
            _this.getCurrentUser()
                .then(function (success) {
                var currentUser = JSON.parse(success.response)[0];
                var i = 0;
                var recursiveCreateNotification = function () {
                    if (i >= notifyableRooms.length) {
                        _this.onclose("Succeeded");
                        return;
                    }
                    _this.createNotification(currentUser.id, notifyableRooms[i], function () {
                        i++;
                        recursiveCreateNotification();
                    });
                };
                recursiveCreateNotification();
            });
        });
    };
    UnreadMentionsNotificationsTask.prototype.isEnabled = function () {
        if (this.settings.values.hasKey('isUnreadMentionsNotificationsEnabled')) {
            return this.settings.values['isUnreadMentionsNotificationsEnabled'];
        }
        else {
            return true;
        }
    };
    UnreadMentionsNotificationsTask.prototype.getRooms = function () {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/rooms",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    };
    UnreadMentionsNotificationsTask.prototype.getCurrentUser = function () {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/user",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    };
    UnreadMentionsNotificationsTask.prototype.getUnreadItems = function (userId, roomId) {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/user/" + userId + "/rooms/" + roomId + "/unreadItems",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    };
    UnreadMentionsNotificationsTask.prototype.getMessages = function (roomId, messageId) {
        return WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/rooms/" + roomId + "/chatMessages/" + messageId,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    };
    UnreadMentionsNotificationsTask.prototype.createNotification = function (userId, room, onroomnotified) {
        var _this = this;
        if (room.user) {
            room.image = room.user.avatarUrlMedium;
        }
        else {
            room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
        }
        this.getUnreadItems(userId, room.id)
            .then(function (success) {
            var mentionsId = JSON.parse(success.response).mention;
            var i = 0;
            var recursiveCreateNotificationOfMessage = function () {
                if (i >= mentionsId.length) {
                    onroomnotified();
                    return;
                }
                _this.createNotificationOfMessage(room, mentionsId[i], function () {
                    i++;
                    recursiveCreateNotificationOfMessage();
                });
            };
            recursiveCreateNotificationOfMessage();
        });
    };
    UnreadMentionsNotificationsTask.prototype.createNotificationOfMessage = function (room, messageId, onmentionnotified) {
        var _this = this;
        this.getMessages(room.id, messageId)
            .then(function (success) {
            var message = JSON.parse(success.response);
            var id = room.id + "_mention_" + messageId;
            if (!_this.settings.values[id]) {
                var replyOptions = {
                    args: 'action=reply&roomId=' + room.id,
                    text: '@' + message.fromUser.username + ' ',
                    image: 'assets/icons/send.png'
                };
                _this.sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, 'action=viewRoom&roomId=' + room.id);
                _this.settings.values[id] = true;
            }
            onmentionnotified();
        });
    };
    UnreadMentionsNotificationsTask.prototype.encodeArgsNotification = function (args) {
        return args.replace(/&/g, '&amp;');
    };
    UnreadMentionsNotificationsTask.prototype.encodeTextNotification = function (text) {
        return text.replace('<', '&lt;').replace('>', '&gt;');
    };
    UnreadMentionsNotificationsTask.prototype.sendImageTitleAndTextNotificationWithReply = function (image, title, text, replyOptions, args) {
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
        var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
        toastXml.loadXml(toast);
        var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toastNotification);
    };
    return UnreadMentionsNotificationsTask;
}(BackgroundTask));
importScripts("/dist/winjs/js/base.js");
var backgroundTask = new UnreadMentionsNotificationsTask();
backgroundTask.execute();
