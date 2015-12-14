// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO : This application has been newly launched, initialize your application here
                let oauth = new TimmyTools.oauth();

                oauth.connect().then(t => {
                    console.log('Sucessfully logged to Gitter API');
                });
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

    angular.module('modern-gitter', ['winjs'])
        .controller('RoomsCtrl', function ($scope) {
            // properties
            $scope.rooms = [{
                name: "Modern-Gitter"
            }]
        });
})();
