﻿(function () {
    "use strict";

    // import WinJS
    importScripts("/dist/winjs/js/base.js");

    // get information about the current instance of the background task
    var cancel = false;
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
        var token = retrieveTokenFromVault();

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

                // add notifications for unread messages
                for (var i = 0; i < notifyableRooms.length; i++) {
                    // show notifications (if possible)
                    createNotification(notifyableRooms[i]);
                }

                // record information in LocalSettings to communicate with the app
                key = backgroundTaskInstance.task.taskId.toString();
                settings.values[key] = "Succeeded";

                // background task must call close when it is done
                close();
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

    function createNotification(room) {
        var id = room.name;
        var localSettings = Windows.Storage.ApplicationData.current.localSettings;

        // detect if there is no new notification to launch (no unread messages)
        if (localSettings.values[id]) {
            // reset notification id for the future
            if (room.unreadItems == 0)
                localSettings.values.remove(id);

            return;
        }

        if (room.unreadItems > 0) {
            // show notifications (toast notifications)
            sendTitleAndTextNotification("New messages", room.name + ": " + room.unreadItems + " unread messages");
            localSettings.values[id] = room.unreadItems;
        }
    }

    function sendTitleAndTextNotification(title, text) {
        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
        var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

        var toastTextElements = toastXml.getElementsByTagName('text');
        toastTextElements[0].appendChild(toastXml.createTextNode(title));
        toastTextElements[1].appendChild(toastXml.createTextNode(text));

        var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
        toastNotifier.show(toast);
    }

    // execute or not the backgroudn task
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
