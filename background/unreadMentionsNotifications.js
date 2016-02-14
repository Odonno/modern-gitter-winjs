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
        if (room.user) {
            room.image = room.user.avatarUrlMedium;
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
                // add ability to answer to the message directly inside notification
                var replyOptions = {
                    args: 'action=reply&roomId=' + room.id,
                    text: '@' + message.fromUser.username + ' ',
                    image: 'assets/icons/send.png'
                };

                // show notifications (toast notifications)
                sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, 'action=viewRoom&roomId=' + room.id);
                localSettings.values[id] = true;
            }

            onMentionNotified();
        });
    }

    function sendImageTitleAndTextNotificationWithReply(image, title, text, replyOptions, args) {
        // create toast content
        var toast = '<toast launch="' + args + '">'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + image + '" />'
                    + '<text>' + title + '</text>'
                    + '<text>' + text + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '<actions>'
                    + '<input id="message" type="text" placeHolderContent="Type a reply" defaultInput="' + replyOptions.text + '" />'
                    + '<action content="Send" imageUri="' + replyOptions.image + '" hint-inputId="message" activationType="background" arguments="' + replyOptions.args + '" />'
                    + '</actions>'
                    + '</toast>';
        toast = toast.replace(/&/g, '&amp;');

        // generate XML from toast content
        var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
        toastXml.loadXml(toast);

        // create toast notification and display it
        var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toastNotification);
    }

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
