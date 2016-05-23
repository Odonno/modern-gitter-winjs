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
var UnreadItemsNotificationsTask = (function (_super) {
    __extends(UnreadItemsNotificationsTask, _super);
    function UnreadItemsNotificationsTask() {
        _super.apply(this, arguments);
    }
    UnreadItemsNotificationsTask.prototype.canExecute = function () {
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
    UnreadItemsNotificationsTask.prototype.execute = function () {
        var _this = this;
        if (!this.canExecute()) {
            return;
        }
        this.getRooms()
            .then(function (success) {
            var rooms = JSON.parse(success.response);
            var notifyableRooms = [];
            for (var i = 0; i < rooms.length; i++) {
                if (!rooms[i].lurk) {
                    notifyableRooms.push(rooms[i]);
                }
            }
            for (var i = 0; i < notifyableRooms.length; i++) {
                _this.createNotification(notifyableRooms[i]);
            }
            _this.onclose("Succeeded");
        });
    };
    UnreadItemsNotificationsTask.prototype.isEnabled = function () {
        if (this.settings.values.hasKey('isUnreadItemsNotificationsEnabled')) {
            return this.settings.values['isUnreadItemsNotificationsEnabled'];
        }
        else {
            return true;
        }
    };
    UnreadItemsNotificationsTask.prototype.getRooms = function () {
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
    UnreadItemsNotificationsTask.prototype.createNotification = function (room) {
        var id = room.name;
        if (this.settings.values[id]) {
            if (room.unreadItems == 0) {
                this.settings.values.remove(id);
            }
            return;
        }
        if (room.unreadItems > 0) {
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            }
            else {
                room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
            }
            this.sendImageTitleAndTextNotification(room.image, "New messages", room.name + ": " + room.unreadItems + " unread messages", 'action=viewRoom&roomId=' + room.id);
            this.settings.values[id] = room.unreadItems;
        }
    };
    UnreadItemsNotificationsTask.prototype.encodeArgsNotification = function (args) {
        return args.replace(/&/g, '&amp;');
    };
    UnreadItemsNotificationsTask.prototype.encodeTextNotification = function (text) {
        return text.replace('<', '&lt;').replace('>', '&gt;');
    };
    UnreadItemsNotificationsTask.prototype.sendImageTitleAndTextNotification = function (image, title, text, args) {
        var toast = '<toast launch="' + this.encodeArgsNotification(args) + '">'
            + '<visual>'
            + '<binding template="ToastGeneric">'
            + '<image placement="appLogoOverride" src="' + image + '" />'
            + '<text>' + this.encodeTextNotification(title) + '</text>'
            + '<text>' + this.encodeTextNotification(text) + '</text>'
            + '</binding>'
            + '</visual>'
            + '</toast>';
        var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
        toastXml.loadXml(toast);
        var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toastNotification);
    };
    return UnreadItemsNotificationsTask;
}(BackgroundTask));
importScripts("/dist/winjs/js/base.js");
var backgroundTask = new UnreadItemsNotificationsTask();
backgroundTask.execute();
