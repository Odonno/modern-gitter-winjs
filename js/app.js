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
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ApiService = (function () {
            function ApiService(ConfigService, OAuthService) {
                this.ConfigService = ConfigService;
                this.OAuthService = OAuthService;
            }
            ApiService.prototype.getRooms = function () {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "rooms",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.joinRoom = function (name) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'POST',
                        url: _this.ConfigService.baseUrl + "rooms",
                        data: JSON.stringify({ uri: name }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.createChannel = function (channel) {
                var _this = this;
                return new Promise(function (done, error) {
                    if (channel.owner.org) {
                        WinJS.xhr({
                            type: 'POST',
                            url: _this.ConfigService.baseUrl + "private/channels/",
                            data: JSON.stringify({
                                name: channel.name,
                                security: channel.permission.toUpperCase(),
                                ownerUri: channel.owner.name
                            }),
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + _this.OAuthService.refreshToken
                            }
                        }).then(function (success) {
                            done(JSON.parse(success.response));
                        });
                    }
                    else {
                        WinJS.xhr({
                            type: 'POST',
                            url: _this.ConfigService.baseUrl + "user/" + channel.owner.id + "/channels",
                            data: JSON.stringify({
                                name: channel.name,
                                security: channel.permission.toUpperCase()
                            }),
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + _this.OAuthService.refreshToken
                            }
                        }).then(function (success) {
                            done(JSON.parse(success.response));
                        });
                    }
                });
            };
            ;
            ApiService.prototype.deleteRoom = function (roomId) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'DELETE',
                        url: _this.ConfigService.baseUrl + "rooms/" + roomId,
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.getMessages = function (roomId, beforeId) {
                var _this = this;
                return new Promise(function (done, error) {
                    var query = '?limit=' + _this.ConfigService.messagesLimit;
                    if (beforeId) {
                        query += '&beforeId=' + beforeId;
                    }
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages" + query,
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.sendMessage = function (roomId, text) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'POST',
                        url: _this.ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages",
                        data: JSON.stringify({ text: text }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.getCurrentUser = function () {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "user/",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response)[0]);
                    });
                });
            };
            ;
            ApiService.prototype.getOrganizations = function (userId) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "user/" + userId + "/orgs",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.getRepositories = function (userId) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "user/" + userId + "/repos",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response));
                    });
                });
            };
            ;
            ApiService.prototype.searchUsers = function (query, limit) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "user?q=" + query + "&limit=" + limit + "&type=gitter",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + _this.OAuthService.refreshToken
                        }
                    }).then(function (success) {
                        done(JSON.parse(success.response).results);
                    });
                });
            };
            ;
            return ApiService;
        })();
        Services.ApiService = ApiService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ConfigService = (function () {
            function ConfigService() {
                this.baseUrl = "https://api.gitter.im/v1/";
                this.tokenUri = "https://gitter.im/login/oauth/token";
                this.clientId = "0f3fc414587a8d31a1514e005fa157168ad8efdb";
                this.clientSecret = "55c361ef1de79ffef1a49a1a0bff1a7a0140799c";
                this.redirectUri = "http://localhost";
                this.authUri = "https://gitter.im/login/oauth/authorize";
                this.messagesLimit = 50;
            }
            return ConfigService;
        })();
        Services.ConfigService = ConfigService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var FeatureToggleService = (function () {
            function FeatureToggleService() {
                this.isWindowsApp = function () {
                    try {
                        if (Windows) {
                            return true;
                        }
                    }
                    catch (e) {
                        return false;
                    }
                };
            }
            return FeatureToggleService;
        })();
        Services.FeatureToggleService = FeatureToggleService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var NetworkService = (function () {
            function NetworkService(FeatureToggleService) {
                this.FeatureToggleService = FeatureToggleService;
                this.currentStatus();
            }
            NetworkService.prototype.currentStatus = function () {
                if (this.FeatureToggleService.isWindowsApp()) {
                    var internetConnectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
                    var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
                    this.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
                    return this.internetAvailable;
                }
                else {
                    return true;
                }
            };
            NetworkService.prototype.statusChanged = function (callback) {
                var _this = this;
                if (this.FeatureToggleService.isWindowsApp()) {
                    Windows.Networking.Connectivity.NetworkInformation.onnetworkstatuschanged = function (ev) {
                        callback(_this.currentStatus());
                    };
                }
            };
            ;
            return NetworkService;
        })();
        Services.NetworkService = NetworkService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var OAuthService = (function () {
            function OAuthService(ConfigService) {
                this.ConfigService = ConfigService;
                this.refreshToken = '';
            }
            OAuthService.prototype.initialize = function () {
                this.refreshToken = this.retrieveTokenFromVault();
            };
            ;
            OAuthService.prototype.connect = function () {
                var _this = this;
                this.initialize();
                return new Promise(function (done, error) {
                    if (!_this.refreshToken) {
                        _this.authenticate().then(function (token) { return _this.grant(token).then(function (accessToken) {
                            var cred = new Windows.Security.Credentials
                                .PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                            _this.refreshToken = accessToken.access_token;
                            var passwordVault = new Windows.Security.Credentials.PasswordVault();
                            passwordVault.add(cred);
                            done(_this.refreshToken);
                        }); });
                    }
                    else {
                        done(_this.refreshToken);
                    }
                });
            };
            ;
            OAuthService.prototype.retrieveTokenFromVault = function () {
                var passwordVault = new Windows.Security.Credentials.PasswordVault();
                var storedToken;
                try {
                    var credential = passwordVault.retrieve("OauthToken", "CurrentUser");
                    storedToken = credential.password;
                }
                catch (e) {
                }
                return storedToken;
            };
            OAuthService.prototype.grant = function (token) {
                var oauthUrl = this.ConfigService.tokenUri;
                var clientId = this.ConfigService.clientId;
                var clientSecret = this.ConfigService.clientSecret;
                var redirectUrl = this.ConfigService.redirectUri;
                return WinJS.xhr({
                    type: "post",
                    url: oauthUrl,
                    data: this.serializeData({
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
            };
            ;
            OAuthService.prototype.authenticate = function () {
                var _this = this;
                return new Promise(function (complete, error) {
                    var oauthUrl = _this.ConfigService.authUri;
                    var clientId = _this.ConfigService.clientId;
                    var redirectUrl = _this.ConfigService.redirectUri;
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
            };
            OAuthService.prototype.serializeData = function (data, encode) {
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
            };
            return OAuthService;
        })();
        Services.OAuthService = OAuthService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RealtimeApiService = (function () {
            function RealtimeApiService(OAuthService) {
                this.OAuthService = OAuthService;
            }
            RealtimeApiService.prototype.initialize = function () {
                var _this = this;
                return new Promise(function (done, error) {
                    var ClientAuthExt = function () { };
                    ClientAuthExt.prototype.outgoing = function (message, callback) {
                        if (message.channel == '/meta/handshake') {
                            if (!message.ext) {
                                message.ext = {};
                            }
                            message.ext.token = _this.OAuthService.refreshToken;
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
                    _this.client = new Faye.Client('https://ws.gitter.im/faye', { timeout: 60, retry: 5, interval: 1 });
                    _this.client.addExtension(new ClientAuthExt());
                    done();
                });
            };
            ;
            RealtimeApiService.prototype.subscribe = function (roomId, callback) {
                this.client.subscribe('/api/v1/rooms/' + roomId + '/chatMessages', function (response) {
                    var message = response.model;
                    callback(roomId, message);
                });
            };
            ;
            return RealtimeApiService;
        })();
        Services.RealtimeApiService = RealtimeApiService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RoomsService = (function () {
            function RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService) {
                var _this = this;
                this.OAuthService = OAuthService;
                this.NetworkService = NetworkService;
                this.ApiService = ApiService;
                this.RealtimeApiService = RealtimeApiService;
                this.ToastNotificationService = ToastNotificationService;
                this.initialized = false;
                this.rooms = [];
                if (this.NetworkService.internetAvailable) {
                    this.initialize();
                }
                this.NetworkService.statusChanged(function () {
                    if (!_this.initialized && _this.NetworkService.internetAvailable) {
                        _this.initialize();
                    }
                });
            }
            RoomsService.prototype.addRoom = function (room) {
                var _this = this;
                if (room.user) {
                    room.image = room.user.avatarUrlMedium;
                }
                else {
                    room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
                }
                this.RealtimeApiService.subscribe(room.id, function (roomId, message) {
                    if (_this.onmessagereceived) {
                        _this.onmessagereceived(roomId, message);
                    }
                    _this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text);
                });
                this.rooms.push(room);
            };
            RoomsService.prototype.initialize = function () {
                var _this = this;
                this.OAuthService.connect().then(function (t) {
                    console.log('Sucessfully logged to Gitter API');
                    _this.RealtimeApiService.initialize().then(function (t) {
                        console.log('Sucessfully subscribed to realtime API');
                        _this.ApiService.getRooms().then(function (rooms) {
                            for (var i = 0; i < rooms.length; i++) {
                                _this.addRoom(rooms[i]);
                            }
                            _this.initialized = true;
                        });
                    });
                });
            };
            RoomsService.prototype.selectRoom = function (room) {
                this.currentRoom = room;
                if (this.onroomselected) {
                    this.onroomselected();
                }
            };
            ;
            RoomsService.prototype.createRoom = function (name, callback) {
                var _this = this;
                this.ApiService.joinRoom(name).then(function (room) {
                    _this.addRoom(room);
                    callback(room);
                });
            };
            ;
            RoomsService.prototype.createChannel = function (channel, callback) {
                var _this = this;
                this.ApiService.createChannel(channel).then(function (room) {
                    _this.addRoom(room);
                    callback(room);
                });
            };
            ;
            return RoomsService;
        })();
        Services.RoomsService = RoomsService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ToastNotificationService = (function () {
            function ToastNotificationService(FeatureToggleService) {
                if (FeatureToggleService.isWindowsApp()) {
                    this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
                }
            }
            ToastNotificationService.prototype.sendTextNotification = function (text) {
                var template = Windows.UI.Notifications.ToastTemplateType.toastText01;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));
                var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toast);
            };
            ;
            ToastNotificationService.prototype.sendTitleAndTextNotification = function (title, text) {
                var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));
                var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toast);
            };
            ;
            ToastNotificationService.prototype.sendImageAndTextNotification = function (image, text) {
                var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText01;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                var toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);
                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(text));
                var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toast);
            };
            ;
            ToastNotificationService.prototype.sendImageTitleAndTextNotification = function (image, title, text) {
                var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
                var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                var toastImageElements = toastXml.getElementsByTagName('image');
                toastImageElements[0].setAttribute('src', image);
                var toastTextElements = toastXml.getElementsByTagName('text');
                toastTextElements[0].appendChild(toastXml.createTextNode(title));
                toastTextElements[1].appendChild(toastXml.createTextNode(text));
                var toast = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toast);
            };
            ;
            return ToastNotificationService;
        })();
        Services.ToastNotificationService = ToastNotificationService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        var NgEnter = (function () {
            function NgEnter() {
                this.link = function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attrs['ngEnter']);
                            });
                            event.preventDefault();
                        }
                    });
                };
            }
            return NgEnter;
        })();
        Directives.NgEnter = NgEnter;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddChannelRoomCtrl = (function () {
            function AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService) {
                var _this = this;
                this.scope = $scope;
                this.scope.owners = [];
                this.scope.permissions = [
                    {
                        name: "Public",
                        description: "Anyone in the world can join."
                    },
                    {
                        name: "Private",
                        description: "Only people added to the room can join."
                    }
                ];
                this.scope.channel = {};
                this.scope.selectOwner = function (owner) {
                    _this.scope.channel.owner = owner;
                };
                this.scope.createRoom = function () {
                    RoomsService.createChannel(_this.scope.channel, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'The channel ' + room.name + ' has been successfully created');
                        RoomsService.selectRoom(room);
                        $state.go('room');
                    });
                };
                ApiService.getCurrentUser().then(function (user) {
                    _this.scope.owners.push({
                        id: user.id,
                        name: user.username,
                        image: user.avatarUrlSmall,
                        org: false
                    });
                    ApiService.getOrganizations(user.id).then(function (orgs) {
                        for (var i = 0; i < orgs.length; i++) {
                            _this.scope.owners.push({
                                id: orgs[i].id,
                                name: orgs[i].name,
                                image: orgs[i].avatar_url,
                                org: true
                            });
                        }
                    });
                });
            }
            return AddChannelRoomCtrl;
        })();
        Controllers.AddChannelRoomCtrl = AddChannelRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddOneToOneRoomCtrl = (function () {
            function AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService) {
                var _this = this;
                this.scope = $scope;
                this.scope.username = '';
                this.scope.users = [];
                this.scope.selection = [];
                this.scope.createRoom = function () {
                    var selectedUser = _this.scope.users[_this.scope.selection[0]];
                    RoomsService.createRoom(selectedUser.username, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name);
                        RoomsService.selectRoom(room);
                        $state.go('room');
                    });
                };
                this.scope.$watch('username', function () {
                    if (_this.scope.username && _this.scope.username.length > 0) {
                        ApiService.searchUsers(_this.scope.username, 50).then(function (users) {
                            _this.scope.users = users;
                            setTimeout(function () {
                                _this.scope.usersWinControl.forceLayout();
                            }, 500);
                        });
                    }
                });
            }
            return AddOneToOneRoomCtrl;
        })();
        Controllers.AddOneToOneRoomCtrl = AddOneToOneRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddRepositoryRoomCtrl = (function () {
            function AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
                var _this = this;
                this.scope = $scope;
                this.scope.selection = [];
                this.scope.createRoom = function () {
                    var repository = _this.scope.repositoriesWithoutRoom[_this.scope.selection[0]];
                    RoomsService.createRoom(repository.uri, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created');
                        RoomsService.selectRoom(room);
                        $state.go('room');
                    });
                };
                ApiService.getCurrentUser().then(function (user) {
                    ApiService.getRepositories(user.id).then(function (repositories) {
                        _this.scope.repositories = repositories;
                    });
                });
                this.scope.$watch('repositories', function () {
                    _this.scope.repositoriesWithoutRoom = $filter('filter')(_this.scope.repositories, { exists: false });
                    setTimeout(function () {
                        _this.scope.repositoriesWinControl.forceLayout();
                    }, 500);
                }, true);
            }
            return AddRepositoryRoomCtrl;
        })();
        Controllers.AddRepositoryRoomCtrl = AddRepositoryRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddRoomCtrl = (function () {
            function AddRoomCtrl($scope) {
                this.scope = $scope;
            }
            return AddRoomCtrl;
        })();
        Controllers.AddRoomCtrl = AddRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, RoomsService, FeatureToggleService) {
                this.scope = $scope;
                if (FeatureToggleService.isWindowsApp()) {
                    var currentPackage = Windows.ApplicationModel.Package.current;
                    var packageVersion = currentPackage.id.version;
                    this.scope.appVersion = packageVersion.major + '.' + packageVersion.minor + '.' + packageVersion.build;
                }
                else {
                    this.scope.appVersion = 'web';
                }
            }
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var RoomCtrl = (function () {
            function RoomCtrl($scope, ApiService, RoomsService) {
                var _this = this;
                this.scope = $scope;
                this.scope.hideProgress = true;
                this.scope.room = RoomsService.currentRoom;
                this.scope.messages = [];
                this.scope.sendMessage = function () {
                    if (_this.scope.textMessage) {
                        ApiService.sendMessage(_this.scope.room.id, _this.scope.textMessage).then(function (message) {
                            _this.scope.textMessage = '';
                        });
                    }
                    else {
                        console.error('textMessage is empty');
                    }
                };
                if (!this.scope.room) {
                    console.error('no room selected...');
                    return;
                }
                RoomsService.onmessagereceived = function (roomId, message) {
                    if (_this.scope.room && _this.scope.room.id === roomId) {
                        _this.scope.messages.push(message);
                    }
                };
                ApiService.getMessages(this.scope.room.id).then(function (messages) {
                    _this.scope.messages = messages;
                    _this.scope.messagesWinControl.forceLayout();
                    setTimeout(function () {
                        _this.scope.messagesWinControl.ensureVisible(_this.scope.messages.length - 1);
                        _this.scope.hideProgress = false;
                        _this.scope.messagesWinControl.onheadervisibilitychanged = function (ev) {
                            var visible = ev.detail.visible;
                            if (visible && _this.scope.messages.length > 0) {
                                var lastVisible = _this.scope.messagesWinControl.indexOfLastVisible;
                                ApiService.getMessages(_this.scope.room.id, _this.scope.messages[0].id).then(function (beforeMessages) {
                                    if (beforeMessages.length === 0) {
                                        _this.scope.hideProgress = true;
                                        return;
                                    }
                                    for (var i = beforeMessages.length - 1; i >= 0; i--) {
                                        _this.scope.messages.unshift(beforeMessages[i]);
                                    }
                                    setTimeout(function () {
                                        _this.scope.messagesWinControl.ensureVisible(lastVisible + beforeMessages.length);
                                    }, 250);
                                });
                            }
                        };
                    }, 500);
                });
            }
            return RoomCtrl;
        })();
        Controllers.RoomCtrl = RoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var RoomsCtrl = (function () {
            function RoomsCtrl($scope, $filter, $state, RoomsService) {
                var _this = this;
                this.scope = $scope;
                this.scope.rooms = RoomsService.rooms;
                this.scope.selectRoom = function (room) {
                    RoomsService.selectRoom(room);
                    $state.go('room');
                };
                this.scope.$watchGroup(['rooms', 'search'], function () {
                    _this.scope.filteredRooms = $filter('filter')(_this.scope.rooms, { name: _this.scope.search });
                    _this.scope.filteredRooms = $filter('orderBy')(_this.scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
                });
            }
            return RoomsCtrl;
        })();
        Controllers.RoomsCtrl = RoomsCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var appModule = angular.module('modern-gitter', ['winjs', 'ngSanitize', 'ui.router']);
appModule.config(function ($stateProvider, $urlRouterProvider) { return new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider); });
appModule.service('ApiService', function (ConfigService, OAuthService) { return new Application.Services.ApiService(ConfigService, OAuthService); });
appModule.service('ConfigService', function () { return new Application.Services.ConfigService(); });
appModule.service('FeatureToggleService', function () { return new Application.Services.FeatureToggleService(); });
appModule.service('NetworkService', function (FeatureToggleService) { return new Application.Services.NetworkService(FeatureToggleService); });
appModule.service('OAuthService', function (ConfigService) { return new Application.Services.OAuthService(ConfigService); });
appModule.service('RealtimeApiService', function (OAuthService) { return new Application.Services.RealtimeApiService(OAuthService); });
appModule.service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService) { return new Application.Services.RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService); });
appModule.service('ToastNotificationService', function (FeatureToggleService) { return new Application.Services.ToastNotificationService(FeatureToggleService); });
appModule.directive('ngEnter', function () { return new Application.Directives.NgEnter(); });
appModule.controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddOneToOneRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRepositoryRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRoomCtrl', function ($scope) { return new Application.Controllers.AddRoomCtrl($scope); });
appModule.controller('HomeCtrl', function ($scope, RoomsService, FeatureToggleService) { return new Application.Controllers.HomeCtrl($scope, RoomsService, FeatureToggleService); });
appModule.controller('RoomCtrl', function ($scope, ApiService, RoomsService) { return new Application.Controllers.RoomCtrl($scope, ApiService, RoomsService); });
appModule.controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService) { return new Application.Controllers.RoomsCtrl($scope, $filter, $state, RoomsService); });
