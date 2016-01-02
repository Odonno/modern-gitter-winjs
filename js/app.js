angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            })
            .state('addRoom', {
                url: '/addRoom',
                views: {
                    '': {
                        templateUrl: 'partials/addRoom.html',
                        controller: 'AddRoomCtrl'
                    },
                    'repository@addRoom': {
                        templateUrl: 'partials/repository.html',
                        controller: 'AddRepositoryRoomCtrl'
                    },
                    'channel@addRoom': {
                        templateUrl: 'partials/channel.html',
                        controller: 'AddChannelRoomCtrl'
                    },
                    'oneToOne@addRoom': {
                        templateUrl: 'partials/oneToOne.html',
                        controller: 'AddOneToOneRoomCtrl'
                    }
                }
            })
            .state('rooms', {
                url: '/rooms',
                templateUrl: 'partials/rooms.html',
                controller: 'RoomsCtrl'
            })
            .state('room', {
                url: '/room',
                templateUrl: 'partials/room.html',
                controller: 'RoomCtrl'
            });
    });
angular.module('modern-gitter')
    .controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.owners = [];
        $scope.permissions = [
            {
                name: "Public",
                description: "Anyone in the world can join."
            },
            {
                name: "Private",
                description: "Only people added to the room can join."
            }
        ];
        $scope.channel = {};
        
        // methods
        $scope.selectOwner = function (owner) {
            $scope.channel.owner = owner;
        };

        $scope.createRoom = function () {
            RoomsService.createChannel($scope.channel, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'The channel ' + room.name + ' has been successfully created');
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            $scope.owners.push({
                name: user.username,
                image: user.avatarUrlSmall,
                org: false
            });

            ApiService.getOrganizations(user.id).then(function (orgs) {
                for (var i = 0; i < orgs.length; i++) {
                    $scope.owners.push({
                        name: orgs[i].name,
                        image: orgs[i].avatar_url,
                        org: true
                    });
                }
            });
        });
    });
angular.module('modern-gitter')
    .controller('AddOneToOneRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.username = '';
        $scope.users = [];
        $scope.selection = [];
        
        // methods
        $scope.createRoom = function () {
            var selectedUser = $scope.users[$scope.selection[0]];
            RoomsService.createRoom(selectedUser.username, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name);
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // watch events
        $scope.$watch('username', function () {
            if ($scope.username && $scope.username.length > 0) {
                ApiService.searchUsers($scope.username, 50).then(function (users) {
                    $scope.users = users.results;

                    setTimeout(function () {
                        $scope.usersWinControl.forceLayout();
                    }, 500);
                });
            }
        });
    });
angular.module('modern-gitter')
    .controller('AddRepositoryRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
        // properties
        $scope.selection = [];
        
        // methods
        $scope.createRoom = function () {
            var repository = $scope.repositoriesWithoutRoom[$scope.selection[0]];
            RoomsService.createRoom(repository.uri, function (room) {
                ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created');
                RoomsService.selectRoom(room);
                $state.go('room');
            });
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            ApiService.getRepositories(user.id).then(function (repositories) {
                $scope.repositories = repositories;
            });
        });
        
        // watch events
        $scope.$watch('repositories', function () {
            $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });

            setTimeout(function () {
                $scope.repositoriesWinControl.forceLayout();
            }, 500);
        }, true);
    });
angular.module('modern-gitter')
    .controller('AddRoomCtrl', function ($scope, $filter, ApiService) {
        // properties
        $scope.username = '';
        $scope.users = [];
        $scope.owners = [];
        $scope.channel = {};
        
        // methods
        $scope.selectOwner = function (owner) {
            $scope.channel.owner = owner;
        };
        
        // initialize controller
        ApiService.getCurrentUser().then(function (user) {
            $scope.owners.push(user);

            ApiService.getRepositories(user.id).then(function (repositories) {
                $scope.repositories = repositories;
            });
        });
        
        // watch events
        $scope.$watch('repositories', function () {
            $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
        }, true);

        $scope.$watch('username', function () {
            if ($scope.username) {
                ApiService.searchUsers($scope.username, 30).then(function (users) {
                    $scope.users = users.results;
                });
            }
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
            if ($scope.textMessage) {
                ApiService.sendMessage($scope.room.id, $scope.textMessage).then(message => {
                    $scope.textMessage = '';
                });
            } else {
                console.error('textMessage is empty');
            }
        };

        // initialize controller
        if (!$scope.room) {
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

        apiService.joinRoom = function (name) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'POST',
                    url: ConfigService.baseUrl + "rooms",
                    data: JSON.stringify({ uri: name }),
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

        apiService.createChannel = function (channel) {
            return new Promise((done, error) => {
                if (channel.owner.org) {
                    WinJS.xhr({
                        type: 'POST',
                        url: ConfigService.baseUrl + "private/channels/",
                        data: JSON.stringify({
                            name: channel.name,
                            security: channel.permission.toUpperCase(),
                            ownerUri: channel.owner.name
                        }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                } else {
                    WinJS.xhr({
                        type: 'POST',
                        url: ConfigService.baseUrl + "user/" + channel.owner.id + "/channels",
                        data: JSON.stringify({
                            name: channel.name,
                            security: channel.permission.toUpperCase()
                        }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                }
            });
        };

        apiService.deleteRoom = function (roomId) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'DELETE',
                    url: ConfigService.baseUrl + "rooms/" + roomId,
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

        apiService.getCurrentUser = function () {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "user/",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + OAuthService.refreshToken
                    }
                }).then(function (success) {
                    done(JSON.parse(success.response)[0]);
                });
            });
        };

        apiService.getOrganizations = function (userId) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "user/" + userId + "/orgs",
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

        apiService.getRepositories = function (userId) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "user/" + userId + "/repos",
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

        apiService.searchUsers = function (query, limit) {
            return new Promise((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: ConfigService.baseUrl + "user?q=" + query + "&limit=" + limit + "&type=gitter",
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

        // private methods
        function addRoom(room) {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
            }
                
            // subscribe to realtime messages
            RealtimeApiService.subscribe(room.id, function (roomId, message) {
                if (roomsService.onmessagereceived) {
                    roomsService.onmessagereceived(roomId, message);
                }
                // TODO : send notification
            });

            roomsService.rooms.push(room);
        }

        // public methods
        roomsService.initialize = function () {
            OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    ApiService.getRooms().then(rooms => {
                        for (var i = 0; i < rooms.length; i++) {
                            addRoom(rooms[i]);
                        }
                        roomsService.initialized = true;
                    });
                });
            });
        }

        roomsService.selectRoom = function (room) {
            roomsService.currentRoom = room;
            if (roomsService.onroomselected) {
                roomsService.onroomselected();
            }
        };

        roomsService.createRoom = function (name, callback) {
            ApiService.joinRoom(name).then(room => {
                addRoom(room);
                callback(room);
            });
        };
        
        roomsService.createChannel = function (channel, callback) {
            ApiService.createChannel(channel).then(room => {
                addRoom(room);
                callback(room);
            });
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
angular.module('modern-gitter')
    .service('ToastNotificationService', function () {
        var toastNotificationService = this;

        var notifications = Windows.UI.Notifications;
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        
        toastNotificationService.sendTextNotification = function (text) {
            var template = notifications.ToastTemplateType.toastText01;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        toastNotificationService.sendTitleAndTextNotification = function (title, text) {
            var template = notifications.ToastTemplateType.toastText02;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(title));
            toastTextElements[1].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        toastNotificationService.sendImageAndTextNotification = function (image, text) {
            var template = notifications.ToastTemplateType.toastImageAndText01;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

            var toastImageElements = toastXml.getElementsByTagName('image');
            toastImageElements[0].setAttribute('src', image);

            var toastTextElements = toastXml.getElementsByTagName('text');
            toastTextElements[0].appendChild(toastXml.createTextNode(text));

            var toast = new notifications.ToastNotification(toastXml);
            toastNotifier.show(toast);
        };

        return toastNotificationService;
    });