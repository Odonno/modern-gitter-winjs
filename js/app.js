var Application;
(function (Application) {
    var Configs;
    (function (Configs) {
        var RoutingConfig = (function () {
            function RoutingConfig($stateProvider, $urlRouterProvider) {
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
            }
            return RoutingConfig;
        })();
        Configs.RoutingConfig = RoutingConfig;
    })(Configs = Application.Configs || (Application.Configs = {}));
})(Application || (Application = {}));
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);
appModule.config(function ($stateProvider, $urlRouterProvider) { return new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider); });
angular.module('modern-gitter')
    .controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) {
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
    ApiService.getCurrentUser().then(function (user) {
        $scope.owners.push({
            id: user.id,
            name: user.username,
            image: user.avatarUrlSmall,
            org: false
        });
        ApiService.getOrganizations(user.id).then(function (orgs) {
            for (var i = 0; i < orgs.length; i++) {
                $scope.owners.push({
                    id: orgs[i].id,
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
    $scope.username = '';
    $scope.users = [];
    $scope.selection = [];
    $scope.createRoom = function () {
        var selectedUser = $scope.users[$scope.selection[0]];
        RoomsService.createRoom(selectedUser.username, function (room) {
            ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name);
            RoomsService.selectRoom(room);
            $state.go('room');
        });
    };
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
    $scope.selection = [];
    $scope.createRoom = function () {
        var repository = $scope.repositoriesWithoutRoom[$scope.selection[0]];
        RoomsService.createRoom(repository.uri, function (room) {
            ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created');
            RoomsService.selectRoom(room);
            $state.go('room');
        });
    };
    ApiService.getCurrentUser().then(function (user) {
        ApiService.getRepositories(user.id).then(function (repositories) {
            $scope.repositories = repositories;
        });
    });
    $scope.$watch('repositories', function () {
        $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
        setTimeout(function () {
            $scope.repositoriesWinControl.forceLayout();
        }, 500);
    }, true);
});
angular.module('modern-gitter')
    .controller('AddRoomCtrl', function ($scope, $filter, ApiService) {
    $scope.username = '';
    $scope.users = [];
    $scope.owners = [];
    $scope.channel = {};
    $scope.selectOwner = function (owner) {
        $scope.channel.owner = owner;
    };
    ApiService.getCurrentUser().then(function (user) {
        $scope.owners.push(user);
        ApiService.getRepositories(user.id).then(function (repositories) {
            $scope.repositories = repositories;
        });
    });
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
    var currentPackage = Windows.ApplicationModel.Package.current;
    $scope.appVersion = currentPackage.id.version;
});
angular.module('modern-gitter')
    .controller('RoomCtrl', function ($scope, ApiService, RoomsService) {
    $scope.hideProgress = true;
    $scope.room = RoomsService.currentRoom;
    $scope.messages = [];
    $scope.sendMessage = function () {
        if ($scope.textMessage) {
            ApiService.sendMessage($scope.room.id, $scope.textMessage).then(function (message) {
                $scope.textMessage = '';
            });
        }
        else {
            console.error('textMessage is empty');
        }
    };
    if (!$scope.room) {
        console.error('no room selected...');
        return;
    }
    RoomsService.onmessagereceived = function (roomId, message) {
        if ($scope.room && $scope.room.id === roomId) {
            $scope.messages.push(message);
        }
    };
    ApiService.getMessages($scope.room.id).then(function (messages) {
        $scope.messages = messages;
        $scope.messagesWinControl.forceLayout();
        setTimeout(function () {
            $scope.messagesWinControl.ensureVisible($scope.messages.length - 1);
            $scope.hideProgress = false;
            $scope.messagesWinControl.onheadervisibilitychanged = function (ev) {
                var visible = ev.detail.visible;
                if (visible && $scope.messages.length > 0) {
                    var lastVisible = $scope.messagesWinControl.indexOfLastVisible;
                    ApiService.getMessages($scope.room.id, $scope.messages[0].id).then(function (beforeMessages) {
                        if (beforeMessages.length === 0) {
                            $scope.hideProgress = true;
                            return;
                        }
                        for (var i = beforeMessages.length - 1; i >= 0; i--) {
                            $scope.messages.unshift(beforeMessages[i]);
                        }
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
    $scope.selectRoom = function (room) {
        RoomsService.selectRoom(room);
        $state.go('room');
    };
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
            }
            else {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
        return new Promise(function (done, error) {
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
    };
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
    var oauthService = this;
    oauthService.refreshToken = '';
    oauthService.initialize = function () {
        oauthService.refreshToken = retrieveTokenFromVault();
    };
    oauthService.connect = function () {
        oauthService.initialize();
        return new Promise(function (done, error) {
            if (!oauthService.refreshToken) {
                authenticate().then(function (token) { return grant(token).then(function (accessToken) {
                    var cred = new Windows.Security.Credentials
                        .PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                    oauthService.refreshToken = accessToken.access_token;
                    var passwordVault = new Windows.Security.Credentials.PasswordVault();
                    passwordVault.add(cred);
                    done(oauthService.refreshToken);
                }); });
            }
            else {
                done(oauthService.refreshToken);
            }
        });
    };
    function retrieveTokenFromVault() {
        var passwordVault = new Windows.Security.Credentials.PasswordVault();
        var storedToken;
        try {
            var credential = passwordVault.retrieve("OauthToken", "CurrentUser");
            storedToken = credential.password;
        }
        catch (e) {
        }
        return storedToken;
    }
    function grant(token) {
        var oauthUrl = ConfigService.tokenUri;
        var clientId = ConfigService.clientId;
        var clientSecret = ConfigService.clientSecret;
        var redirectUrl = ConfigService.redirectUri;
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
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
            }
        }).then(function (x) { return JSON.parse(x.response); });
    }
    ;
    function authenticate() {
        return new Promise(function (complete, error) {
            var oauthUrl = ConfigService.authUri;
            var clientId = ConfigService.clientId;
            var redirectUrl = ConfigService.redirectUri;
            var requestUri = new Windows.Foundation.Uri(oauthUrl + "?client_id=" + clientId + "&redirect_uri=" + encodeURIComponent(redirectUrl) + "&response_type=code&access_type=offline");
            var callbackUri = new Windows.Foundation.Uri(redirectUrl);
            Windows.Security.Authentication.Web.WebAuthenticationBroker.
                authenticateAsync(Windows.Security.Authentication.Web.
                WebAuthenticationOptions.none, requestUri, callbackUri)
                .done(function (result) {
                if (result.responseStatus === 0) {
                    complete(result.responseData.replace('http://localhost/?code=', ''));
                }
                else {
                    error(result);
                }
            });
        });
    }
    function serializeData(data, encode) {
        if (typeof data !== 'object') {
            return ((data == null) ? "" : data.toString());
        }
        var buffer = [];
        for (var name_1 in data) {
            if (!data.hasOwnProperty(name_1)) {
                continue;
            }
            var value = data[name_1];
            if (!!encode) {
                buffer.push(encodeURIComponent(name_1) + " = " + encodeURIComponent((value == null) ? "" : value));
            }
            else {
                buffer.push(name_1 + "=" + (value == null ? "" : value));
            }
        }
        return buffer.join("&").replace(/%20/g, "+");
    }
    return oauthService;
});
angular.module('modern-gitter')
    .service('RealtimeApiService', function (ConfigService, OAuthService) {
    var realtimeApiService = this;
    realtimeApiService.initialize = function () {
        return new Promise(function (done, error) {
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
                    }
                    else {
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
        realtimeApiService.client.subscribe('/api/v1/rooms/' + roomId + '/chatMessages', function (response) {
            var message = response.model;
            callback(roomId, message);
        });
    };
    return realtimeApiService;
});
angular.module('modern-gitter')
    .service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService) {
    var roomsService = this;
    roomsService.initialized = false;
    roomsService.rooms = [];
    function addRoom(room) {
        if (room.user) {
            room.image = room.user.avatarUrlMedium;
        }
        else {
            room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
        }
        RealtimeApiService.subscribe(room.id, function (roomId, message) {
            if (roomsService.onmessagereceived) {
                roomsService.onmessagereceived(roomId, message);
            }
            ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text);
        });
        roomsService.rooms.push(room);
    }
    roomsService.initialize = function () {
        OAuthService.connect().then(function (t) {
            console.log('Sucessfully logged to Gitter API');
            RealtimeApiService.initialize().then(function (t) {
                console.log('Sucessfully subscribed to realtime API');
                ApiService.getRooms().then(function (rooms) {
                    for (var i = 0; i < rooms.length; i++) {
                        addRoom(rooms[i]);
                    }
                    roomsService.initialized = true;
                });
            });
        });
    };
    roomsService.selectRoom = function (room) {
        roomsService.currentRoom = room;
        if (roomsService.onroomselected) {
            roomsService.onroomselected();
        }
    };
    roomsService.createRoom = function (name, callback) {
        ApiService.joinRoom(name).then(function (room) {
            addRoom(room);
            callback(room);
        });
    };
    roomsService.createChannel = function (channel, callback) {
        ApiService.createChannel(channel).then(function (room) {
            addRoom(room);
            callback(room);
        });
    };
    if (NetworkService.internetAvailable) {
        roomsService.initialize();
    }
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
    toastNotificationService.sendImageTitleAndTextNotification = function (image, title, text) {
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
        var toastImageElements = toastXml.getElementsByTagName('image');
        toastImageElements[0].setAttribute('src', image);
        var toastTextElements = toastXml.getElementsByTagName('text');
        toastTextElements[0].appendChild(toastXml.createTextNode(title));
        toastTextElements[1].appendChild(toastXml.createTextNode(text));
        var toast = new notifications.ToastNotification(toastXml);
        toastNotifier.show(toast);
    };
    return toastNotificationService;
});
