(function () {
    "use strict";

    // import WinJS
    importScripts("/dist/winjs/js/base.js");

    // get information about the current instance of the background task
    var cancel = false;
    var token = '';
    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;

    // associate a cancellation handler with the background task
    function onCanceled(cancelEventArg) {
        cancel = true;
        cancelReason = cancelEventArg;
    }
    backgroundTaskInstance.addEventListener("canceled", onCanceled);

    // do the work of your background task
    function doWork() {
        var key = null;
        var settings = Windows.Storage.ApplicationData.current.localSettings;

        // you need to be authenticated first to get current notifications
        token = retrieveTokenFromVault();

        if (token) {
            // retrieve every room of current user
            WinJS.xhr({
                type: 'GET',
                url: "https://api.gitter.im/v1/rooms",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }).then((success) => {
                var rooms = JSON.parse(success.response);

                // retrieve rooms that user want notifications
                var notifyableRooms = [];
                for (var i = 0; i < rooms.length; i++) {
                    if (!rooms[i].lurk) {
                        notifyableRooms.push(rooms[i]);
                    }
                }

                WinJS.xhr({
                    type: 'GET',
                    url: "https://api.gitter.im/v1/user",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                }).then((success) => {
                    // retrieve current user
                    var currentUser = JSON.parse(success.response)[0];

                    // add notifications for unread mentions
                    var i = 0;
                    var recursiveCreateNotification = function () {
                        if (i >= notifyableRooms.length) {
                            // record information in LocalSettings to communicate with the app
                            key = backgroundTaskInstance.task.taskId.toString();
                            settings.values[key] = "Succeeded";

                            // background task must call close when it is done
                            close();
                            return;
                        }

                        // show notifications (if possible)
                        createNotification(currentUser.id, notifyableRooms[i], function () {
                            i++;
                            recursiveCreateNotification();
                        });
                    };
                    recursiveCreateNotification();
                });
            });
        } else {
            // record information in LocalSettings to communicate with the app
            key = backgroundTaskInstance.task.taskId.toString();
            settings.values[key] = "Failed";

            // background task must call close when it is done
            close();
        }
    }

    // methods
    function retrieveTokenFromVault() {
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

    function createNotification(userId, room, onRoomNotified) {
        // compute room image
        if (room.fromUser) {
            room.image = room.fromUser.avatarUrlMedium;
        } else {
            room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
        }

        WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/user/" + userId + "/rooms/" + room.id + "/unreadItems",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then((success) => {
            // retrieve id of messages that contains a mention
            var mentionsId = JSON.parse(success.response).mention;

            // Retrieve each message that contains mentions
            var i = 0;
            var recursiveCreateNotificationOfMessage = function () {
                if (i >= mentionsId.length) {
                    onRoomNotified();
                    return;
                }

                // show notifications (if possible)
                createNotificationOfMessage(room, mentionsId[i], function () {
                    i++;
                    recursiveCreateNotificationOfMessage();
                });
            };
            recursiveCreateNotificationOfMessage();
        });
    }

    function createNotificationOfMessage(room, messageId, onMentionNotified) {
        WinJS.xhr({
            type: 'GET',
            url: "https://api.gitter.im/v1/rooms/" + room.id + "/chatMessages/" + messageId,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then((success) => {
            // retrieve message
            var message = JSON.parse(success.response);
            var id = room.id + "_mention_" + messageId;
            var localSettings = Windows.Storage.ApplicationData.current.localSettings;

            if (!localSettings.values[id]) {
                // TODO : add ability to answer to the message directly inside notification
                // show notifications (toast notifications)
                sendImageTitleAndTextNotification(room.image, message.fromUser.username + " mentioned you", message.text);
                localSettings.values[id] = true;
            }

            onMentionNotified();
        });
    }

    function sendImageTitleAndTextNotification(image, title, text) {
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();

        var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

        var toastImageElements = toastXml.getElementsByTagName('image');
        toastImageElements[0].setAttribute('src', image);

        var toastTextElements = toastXml.getElementsByTagName('text');
        toastTextElements[0].appendChild(toastXml.createTextNode(title));
        toastTextElements[1].appendChild(toastXml.createTextNode(text));

        var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
        toastNotifier.show(toast);
    };

    // execute or not the background task
    if (!cancel) {
        doWork();
    } else {
        // record information in LocalSettings to communicate with the app
        key = backgroundTaskInstance.task.taskId.toString();
        settings.values[key] = "Canceled";

        // background task must call close when it is done.
        close();
    }
})();
