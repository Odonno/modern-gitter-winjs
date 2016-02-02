(function () {
    "use strict";

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

        // TODO

        // record information in LocalSettings to communicate with the app
        key = backgroundTaskInstance.task.taskId.toString();
        settings.values[key] = "Succeeded";

        // background task must call close when it is done
        close();
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
