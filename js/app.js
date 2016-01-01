angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl',
            })
            .state('rooms', {
                url: '/rooms',
                templateUrl: 'partials/rooms.html',
                controller: 'RoomsCtrl',
            })
            .state('room', {
                url: '/room',
                templateUrl: 'partials/room.html',
                controller: 'RoomCtrl',
            });
    });
angular.module('modern-gitter')
    .controller('HomeCtrl', function ($scope, RoomsService) {
    });
angular.module('modern-gitter')
    .controller('RoomCtrl', function ($scope, ApiService, RoomsService) {
        // properties
        $scope.hideProgress = true;
        $scope.room = RoomsService.currentRoom;
        $scope.messages = [];

        // methods
        $scope.sendMessage = function () {
            var textMessage = document.getElementById('textMessage');

            if (textMessage.value) {
                ApiService.sendMessage($scope.currentRoom.id, textMessage.value).then(message => {
                    textMessage.value = '';
                });
            } else {
                console.error('textMessage is empty');
            }
        };

        // initialize controller
        if (!RoomsService.currentRoom) {
            console.error('no room selected...');
            return;
        }

        RoomsService.onmessagereceived = function (roomId, message) {
            if ($scope.room && $scope.room.id === roomId) {
                $scope.messages.push(message);
            }
        };

        ApiService.getMessages($scope.room.id).then(messages => {
            $scope.messages = messages;

            // refresh UI
            $scope.messagesWinControl.forceLayout();

            // wait for refresh
            setTimeout(function () {
                // scroll down to the last message
                $scope.messagesWinControl.ensureVisible($scope.messages.length - 1);
                $scope.hideProgress = false;

                $scope.messagesWinControl.onheadervisibilitychanged = function (ev) {
                    var visible = ev.detail.visible;
                    if (visible && $scope.messages.length > 0) {
                        // retrieve index of message that was visible before the load of new messages
                        var lastVisible = $scope.messagesWinControl.indexOfLastVisible;

                        // load more messages
                        ApiService.getMessages($scope.room.id, $scope.messages[0].id).then(beforeMessages => {
                            if (beforeMessages.length === 0) {
                                // no more message to load
                                $scope.hideProgress = true;
                                return;
                            }

                            for (var i = beforeMessages.length - 1; i >= 0; i--) {
                                $scope.messages.unshift(beforeMessages[i]);
                            }

                            // scroll again to stay where the user was (reading message)
                            setTimeout(function () {
                                $scope.messagesWinControl.ensureVisible(lastVisible + beforeMessages.length);
                            }, 250);
                        });
                    }
                };
            }, 500);
        });
    });
angular.module('modern-gitter')
    .controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService) {
        $scope.rooms = RoomsService.rooms;

        // methods
        $scope.selectRoom = function (room) {
            RoomsService.selectRoom(room);
            $state.go('room');
        };

        // watch events
        $scope.$watchGroup(['rooms', 'search'], function () {
            $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
            $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
        });
    });
angular.module('modern-gitter')
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
angular.module('modern-gitter')
    .service('ApiService', function (ConfigService, OAuthService) {
        var apiService = this;

        apiService.getRooms = function () {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "rooms",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + OAuthService.refreshToken
                    }
                }).then(function (success) {
                    done(JSON.parse(success.response));
                });
            });
        };

        apiService.getMessages = function (roomId, beforeId) {
            return new Promise((done, error) => {
                var query = '?limit=' + ConfigService.messagesLimit;

                if (beforeId) {
                    query += '&beforeId=' + beforeId;
                }

                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages" + query,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + OAuthService.refreshToken
                    }
                }).then(function (success) {
                    done(JSON.parse(success.response));
                });
            });
        };

        apiService.sendMessage = function (roomId, text) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'POST',
                    url: ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages",
                    data: JSON.stringify({ text: text }),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + OAuthService.refreshToken
                    }
                }).then(function (success) {
                    done(JSON.parse(success.response));
                });
            });
        };

        return apiService;
    });
angular.module('modern-gitter')
    .service('ConfigService', function () {
        var configService = this;

        configService.baseUrl = "https://api.gitter.im/v1/";
        configService.tokenUri = "https://gitter.im/login/oauth/token";
        configService.clientId = "0f3fc414587a8d31a1514e005fa157168ad8efdb";
        configService.clientSecret = "55c361ef1de79ffef1a49a1a0bff1a7a0140799c";
        configService.redirectUri = "http://localhost";
        configService.authUri = "https://gitter.im/login/oauth/authorize";

        configService.messagesLimit = 50;

        return configService;
    });
angular.module('modern-gitter')
    .service('NetworkService', function () {
        var networkService = this;
        
        var networkInformation = Windows.Networking.Connectivity.NetworkInformation;

        networkService.currentStatus = function () {
            var internetConnectionProfile = networkInformation.getInternetConnectionProfile();
            var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
            networkService.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
            return networkService.internetAvailable;
        }

        networkService.statusChanged = function (callback) {
            networkInformation.onnetworkstatuschanged = function (ev) {
                callback(networkService.currentStatus());
            };
        };

        networkService.currentStatus();

        return networkService;
    });
angular.module('modern-gitter')
    .service('OAuthService', function (ConfigService) {
        // based on the code of Timmy Kokke (https://github.com/sorskoot/UWP-OAuth-demo)
        var oauthService = this;

        oauthService.refreshToken = '';

        oauthService.initialize = function () {
            oauthService.refreshToken = retrieveTokenFromVault();
        };

        oauthService.connect = function () {
            oauthService.initialize();
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
                let requestUri = Windows.Foundation.Uri(`${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl) }&response_type=code&access_type=offline`);
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
                    buffer.push(`${encodeURIComponent(name) } = ${encodeURIComponent((value == null) ? "" : value) }`);
                } else {
                    buffer.push(`${name}=${value == null ? "" : value}`);
                }
            }

            // Serialize the buffer and clean it up for transportation
            return buffer.join("&").replace(/%20/g, "+");
        }

        return oauthService;
    });
angular.module('modern-gitter')
    .service('RealtimeApiService', function (ConfigService, OAuthService) {
        var realtimeApiService = this;

        realtimeApiService.initialize = function () {
            return new Promise((done, error) => {
                var ClientAuthExt = function () { };

                ClientAuthExt.prototype.outgoing = function (message, callback) {
                    if (message.channel == '/meta/handshake') {
                        if (!message.ext) {
                            message.ext = {};
                        }
                        message.ext.token = OAuthService.refreshToken;
                    }

                    callback(message);
                };

                ClientAuthExt.prototype.incoming = function (message, callback) {
                    if (message.channel == '/meta/handshake') {
                        if (message.successful) {
                            console.log('Successfuly subscribed');
                        } else {
                            console.log('Something went wrong: ', message.error);
                        }
                    }

                    callback(message);
                };

                realtimeApiService.client = new Faye.Client('https://ws.gitter.im/faye', { timeout: 60, retry: 5, interval: 1 });
                realtimeApiService.client.addExtension(new ClientAuthExt());

                done();
            });
        };

        realtimeApiService.subscribe = function (roomId, callback) {
            // subscribe to realtime messages
            realtimeApiService.client.subscribe('/api/v1/rooms/' + roomId + '/chatMessages', function (response) {
                var message = response.model;
                callback(roomId, message);
            });
        };

        return realtimeApiService;
    });
angular.module('modern-gitter')
    .service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService) {
        var roomsService = this;

        // properties
        roomsService.initialized = false;
        roomsService.rooms = [];

        // methods
        roomsService.initialize = function () {
            OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    ApiService.getRooms().then(rooms => {
                        roomsService.setRooms(rooms);
                        roomsService.initialized = true;
                    });
                });
            });
        }

        roomsService.setRooms = function (rooms) {
            roomsService.rooms = rooms;

            for (var i = 0; i < roomsService.rooms.length; i++) {
                // compute room image
                if (roomsService.rooms[i].user) {
                    roomsService.rooms[i].image = roomsService.rooms[i].user.avatarUrlMedium;
                } else {
                    roomsService.rooms[i].image = "https://avatars.githubusercontent.com/" + roomsService.rooms[i].name.split('/')[0];
                }

                // subscribe to realtime messages
                RealtimeApiService.subscribe(roomsService.rooms[i].id, function (roomId, message) {
                    if (roomsService.onmessagereceived) {
                        roomsService.onmessagereceived(roomId, message);
                    }
                    // TODO : send notification
                });
            }
        };

        roomsService.selectRoom = function (room) {
            roomsService.currentRoom = room;
            if (roomsService.onroomselected) {
                roomsService.onroomselected();
            }
        };

        // initialize service 
        if (NetworkService.internetAvailable) {
            roomsService.initialize();
        }

        // check when internet status changed
        NetworkService.statusChanged(function () {
            if (!roomsService.initialized && NetworkService.internetAvailable) {
                roomsService.initialize();
            }
        });

        return roomsService;
    });