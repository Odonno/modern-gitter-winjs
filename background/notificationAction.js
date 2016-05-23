var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var NotificationActionTask = (function (_super) {
    __extends(NotificationActionTask, _super);
    function NotificationActionTask() {
        _super.apply(this, arguments);
    }
    NotificationActionTask.prototype.canExecute = function () {
        if (this.cancel) {
            this.onclose("Canceled");
            return false;
        }
        this.token = this.retrieveTokenFromVault();
        if (!this.token) {
            this.onclose("Failed");
            return false;
        }
        return true;
    };
    NotificationActionTask.prototype.execute = function () {
        var _this = this;
        if (!this.canExecute()) {
            return;
        }
        var details = this.backgroundTaskInstance.triggerDetails;
        if (details) {
            var args = details.argument;
            var userInput = details.userInput;
            var roomId = this.getQueryValue(args, 'roomId');
            var text = userInput['message'];
            this.sendMessage(roomId, text)
                .then(function (success) {
                _this.onclose("Succeeded");
            });
        }
    };
    NotificationActionTask.prototype.getQueryValue = function (query, key) {
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == key) {
                return pair[1];
            }
        }
    };
    NotificationActionTask.prototype.sendMessage = function (roomId, text) {
        return WinJS.xhr({
            type: 'POST',
            url: "https://api.gitter.im/v1/rooms/" + roomId + "/chatMessages",
            data: JSON.stringify({ text: text }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    };
    return NotificationActionTask;
}(BackgroundTask));
importScripts("/dist/winjs/js/base.js");
var backgroundTask = new NotificationActionTask();
backgroundTask.execute();
