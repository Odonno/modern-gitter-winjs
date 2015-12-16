﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
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

    WinJS.UI.processAll().then(function () {
        // makes the splitView adaptable to screen size
        var splitView = document.querySelector(".splitView").winControl;
        new WinJS.UI._WinKeyboard(splitView.paneElement);
    });

    app.start();

    angular.module('modern-gitter', ['winjs'])
        .service('ConfigService', function () {
            var configService = this;

            configService.baseUrl = "https://api.gitter.im/v1/";
            configService.tokenUri = "https://gitter.im/login/oauth/token";
            configService.clientId = "0f3fc414587a8d31a1514e005fa157168ad8efdb";
            configService.clientSecret = "55c361ef1de79ffef1a49a1a0bff1a7a0140799c";
            configService.redirectUri = "http://localhost";
            configService.authUri = "https://gitter.im/login/oauth/authorize";

            return configService;
        })
        .service('OAuthService', function (ConfigService) {
            // based on the code of Timmy Kokke (https://github.com/sorskoot/UWP-OAuth-demo)
            var oauthService = this;

            oauthService.refreshToken = '';

            oauthService.initialize = function () {
                oauthService.refreshToken = retrieveTokenFromVault();
            };

            oauthService.connect = function () {
                return new Promise((done, error) => {
                    if (!oauthService.refreshToken) {
                        authenticate().then(
                            token => grant(token).then(accessToken => {
                                let cred = new Windows.Security.Credentials
                                    .PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                                oauthService.refreshToken = accessToken.access_token;
                                let passwordVault = new Windows.Security.Credentials.PasswordVault();
                                passwordVault.add(cred);
                                done(oauthService.refreshToken);
                            }));
                    } else {
                        done(oauthService.refreshToken);
                    }
                });
            };

            function retrieveTokenFromVault() {
                let passwordVault = new Windows.Security.Credentials.PasswordVault();
                let storedToken;

                try {
                    let credential = passwordVault.retrieve("OauthToken", "CurrentUser");
                    storedToken = credential.password;
                    // Uncomment this line to remove the token from the password vault so you'll have to log in again
                    //passwordVault.remove(credential);
                } catch (e) {
                    // no stored credentials
                }

                return storedToken;
            }

            function grant(token) {
                let oauthUrl = ConfigService.tokenUri;
                let clientId = ConfigService.clientId;
                let clientSecret = ConfigService.clientSecret;
                let redirectUrl = ConfigService.redirectUri;

                return WinJS.xhr({
                    type: "post",
                    url: oauthUrl,
                    data: serializeData({
                        code: token,
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirectUrl,
                        grant_type: 'authorization_code'
                    }),
                    headers:
                    {
                        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
                    }
                }).then(x => JSON.parse(x.response));
            };

            function authenticate() {
                return new Promise(function (complete, error) {
                    let oauthUrl = ConfigService.authUri;
                    let clientId = ConfigService.clientId;
                    let redirectUrl = ConfigService.redirectUri;
                    let requestUri = Windows.Foundation.Uri(`${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&access_type=offline`);
                    let callbackUri = Windows.Foundation.Uri(redirectUrl);

                    Windows.Security.Authentication.Web.WebAuthenticationBroker.
                        authenticateAsync(Windows.Security.Authentication.Web.
                            WebAuthenticationOptions.none, requestUri, callbackUri)
                        .done(result => {
                            if (result.responseStatus === 0) {
                                complete(result.responseData.replace('http://localhost/?code=', ''));
                            } else {
                                error(result);
                            }
                        });
                });
            }

            // Serialize a piece of data to a querystring
            function serializeData(data, encode) {
                if (typeof data !== 'object') {
                    return ((data == null) ? "" : data.toString());
                }
                let buffer = [];

                // Serialize each key in the object
                for (let name in data) {
                    if (!data.hasOwnProperty(name)) {
                        continue;
                    }
                    let value = data[name];
                    if (!!encode) {
                        buffer.push(`${encodeURIComponent(name)} = ${encodeURIComponent((value == null) ? "" : value)}`);
                    } else {
                        buffer.push(`${name}=${value == null ? "" : value}`);
                    }
                }

                // Serialize the buffer and clean it up for transportation
                return buffer.join("&").replace(/%20/g, "+");
            }

            return oauthService;
        })
        .service('ApiService', function (ConfigService, OAuthService) {
            var apiService = this;

            apiService.getRooms = function () {
                return new Promise((done, error) => {
                    WinJS
                        .xhr({
                            url: ConfigService.baseUrl + "rooms",
                            headers: { "Content-type": "application/json", "Authorization": "Bearer " + OAuthService.refreshToken }
                        })
                        .then(function (success) {
                            done(JSON.parse(success.response));
                        });
                });
            };

            return apiService;
        })
        .controller('AppCtrl', function ($scope, OAuthService, ApiService) {
            // properties
            $scope.rooms = [];
            $scope.currentRoom = {};

            // methods
            $scope.selectRoom = function (room) {
                $scope.currentRoom = room;
            };

            // initialize controller
            OAuthService.initialize();
            OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                ApiService.getRooms().then(rooms => {
                    $scope.rooms = rooms;

                    // compute room image
                    for (var i = 0; i < $scope.rooms.length; i++) {
                        if ($scope.rooms[i].user) {
                            $scope.rooms[i].image = $scope.rooms[i].user.avatarUrlMedium;
                        } else {
                            $scope.rooms[i].image = "https://avatars.githubusercontent.com/" + $scope.rooms[i].name.split('/')[0];
                        }
                    }

                    $scope.$apply();
                });
            });
        });
})();
