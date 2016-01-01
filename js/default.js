(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO : This application has been newly launched, initialize your application here
            } else {
                // TODO : This application was suspended and then terminated
            }

            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO : This application is about to be suspended, save any state that needs to persist across suspensions here
    };

    app.start();
})();
