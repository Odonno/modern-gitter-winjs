var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var User = (function () {
            function User() {
            }
            return User;
        }());
        Models.User = User;
        var Owner = (function () {
            function Owner() {
            }
            return Owner;
        }());
        Models.Owner = Owner;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var PermissionChannel = (function () {
            function PermissionChannel() {
            }
            return PermissionChannel;
        }());
        Models.PermissionChannel = PermissionChannel;
        var Channel = (function () {
            function Channel() {
            }
            return Channel;
        }());
        Models.Channel = Channel;
        var NewChannel = (function () {
            function NewChannel() {
            }
            return NewChannel;
        }());
        Models.NewChannel = NewChannel;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var Message = (function () {
            function Message() {
            }
            return Message;
        }());
        Models.Message = Message;
        var Mention = (function () {
            function Mention() {
            }
            return Mention;
        }());
        Models.Mention = Mention;
        var Issue = (function () {
            function Issue() {
            }
            return Issue;
        }());
        Models.Issue = Issue;
        (function (MessageOperation) {
            MessageOperation[MessageOperation["Created"] = 1] = "Created";
            MessageOperation[MessageOperation["Updated"] = 2] = "Updated";
            MessageOperation[MessageOperation["Deleted"] = 3] = "Deleted";
            MessageOperation[MessageOperation["ReadBy"] = 4] = "ReadBy";
        })(Models.MessageOperation || (Models.MessageOperation = {}));
        var MessageOperation = Models.MessageOperation;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var Room = (function () {
            function Room() {
            }
            Object.defineProperty(Room.prototype, "isFavourite", {
                get: function () {
                    return this.favourite == 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Room.prototype, "image", {
                get: function () {
                    return this._image;
                },
                set: function (value) {
                    this._image = value;
                },
                enumerable: true,
                configurable: true
            });
            return Room;
        }());
        Models.Room = Room;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var Org = (function () {
            function Org() {
            }
            return Org;
        }());
        Models.Org = Org;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var Repository = (function () {
            function Repository() {
            }
            return Repository;
        }());
        Models.Repository = Repository;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Configs;
    (function (Configs) {
        var NavigationConfig = (function () {
            function NavigationConfig($rootScope, $state, RoomsService, FeatureToggleService) {
                if (FeatureToggleService.isWindowsApp()) {
                    var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                }
                $rootScope.states = [];
                $rootScope.previousState;
                $rootScope.currentState;
                $rootScope.isBack = false;
                $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                    $rootScope.currentState = to.name;
                    if (!from.name || from.name === 'splashscreen') {
                        return;
                    }
                    if (to.name === 'room' && !RoomsService.currentRoom) {
                        $state.go('error');
                    }
                    if (to.name === 'error') {
                        return;
                    }
                    if ($rootScope.isBack) {
                        $rootScope.isBack = false;
                    }
                    else {
                        $rootScope.previousState = from.name;
                        if (FeatureToggleService.isWindowsApp()) {
                            systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
                        }
                        $rootScope.states.push({
                            state: $rootScope.previousState,
                            params: fromParams
                        });
                    }
                });
                if (FeatureToggleService.isWindowsApp()) {
                    systemNavigationManager.onbackrequested = function (args) {
                        if ($rootScope.states.length > 0) {
                            $rootScope.isBack = true;
                            var previous = $rootScope.states.pop();
                            while (previous.state === 'error' && RoomsService.currentRoom) {
                                previous = $rootScope.states.pop();
                            }
                            $rootScope.previousState = previous.state;
                            $state.go(previous.state, previous.params);
                            if ($rootScope.states.length === 0) {
                                systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                            }
                            args.handled = true;
                        }
                        else {
                            systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                        }
                    };
                }
            }
            return NavigationConfig;
        }());
        Configs.NavigationConfig = NavigationConfig;
    })(Configs = Application.Configs || (Application.Configs = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Configs;
    (function (Configs) {
        var RoutingConfig = (function () {
            function RoutingConfig($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/splashscreen');
                $stateProvider
                    .state('error', {
                    url: '/error',
                    templateUrl: 'partials/error.html',
                    controller: 'ErrorCtrl'
                })
                    .state('splashscreen', {
                    url: '/splashscreen',
                    templateUrl: 'partials/splashscreen.html',
                    controller: 'SplashscreenCtrl'
                })
                    .state('home', {
                    url: '/home',
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                })
                    .state('about', {
                    url: '/about',
                    templateUrl: 'partials/about.html',
                    controller: 'AboutCtrl'
                })
                    .state('addRoom', {
                    abstract: true,
                    url: '/addRoom',
                    templateUrl: 'partials/addRoom.html',
                    controller: 'AddRoomCtrl'
                })
                    .state('addRoom.existing', {
                    url: '/existing',
                    templateUrl: 'partials/existing.html',
                    controller: 'AddExistingRoomCtrl'
                })
                    .state('addRoom.repository', {
                    url: '/repository',
                    templateUrl: 'partials/repository.html',
                    controller: 'AddRepositoryRoomCtrl'
                })
                    .state('addRoom.channel', {
                    url: '/channel',
                    templateUrl: 'partials/channel.html',
                    controller: 'AddChannelRoomCtrl'
                })
                    .state('addRoom.oneToOne', {
                    url: '/oneToOne',
                    templateUrl: 'partials/oneToOne.html',
                    controller: 'AddOneToOneRoomCtrl'
                })
                    .state('rooms', {
                    url: '/rooms',
                    templateUrl: 'partials/rooms.html',
                    controller: 'RoomsCtrl'
                })
                    .state('chat', {
                    url: '/chat',
                    templateUrl: 'partials/chat.html',
                    controller: 'ChatCtrl'
                });
            }
            return RoutingConfig;
        }());
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
            ApiService.prototype.markUnreadMessages = function (userId, roomId, messageIds) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'POST',
                        url: _this.ConfigService.baseUrl + "user/" + userId + "/rooms/" + roomId + "/unreadItems",
                        data: JSON.stringify({ chat: messageIds }),
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
            ApiService.prototype.searchRooms = function (query, limit) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "rooms?q=" + query + "&limit=" + limit,
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
        }());
        Services.ApiService = ApiService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var BackgroundTaskService = (function () {
            function BackgroundTaskService(FeatureToggleService) {
                this.tasks = [];
                if (FeatureToggleService.isWindowsApp()) {
                    this.tasks = [
                        {
                            entryPoint: 'background\\unreadItemsNotifications.js',
                            name: 'unreadItemsNotifications',
                            trigger: new Windows.ApplicationModel.Background.TimeTrigger(15, false),
                            condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                        },
                        {
                            entryPoint: 'background\\unreadMentionsNotifications.js',
                            name: 'unreadMentionsNotifications',
                            trigger: new Windows.ApplicationModel.Background.TimeTrigger(15, false),
                            condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                        },
                        {
                            entryPoint: 'background\\notificationAction.js',
                            name: 'notificationAction',
                            trigger: new Windows.ApplicationModel.Background.ToastNotificationActionTrigger(),
                            condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                        }
                    ];
                }
                this.currentVersion = 'v0.6';
            }
            BackgroundTaskService.prototype.register = function (taskEntryPoint, taskName, trigger, condition, cancelOnConditionLoss) {
                if (this.isRegistered(taskName)) {
                    console.error('task already registered...');
                    return;
                }
                Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync().then(function (status) {
                    if (status === Windows.ApplicationModel.Background.BackgroundAccessStatus.denied ||
                        status === Windows.ApplicationModel.Background.BackgroundAccessStatus.unspecified) {
                        console.error('task do not have access...');
                        return;
                    }
                    var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
                    builder.name = taskName;
                    builder.taskEntryPoint = taskEntryPoint;
                    builder.setTrigger(trigger);
                    if (condition) {
                        builder.addCondition(condition);
                        if (cancelOnConditionLoss) {
                            builder.cancelOnConditionLoss = cancelOnConditionLoss;
                        }
                    }
                    var task = builder.register();
                });
            };
            BackgroundTaskService.prototype.unregister = function (taskName) {
                var iteration = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
                var hasCurrent = iteration.hasCurrent;
                while (hasCurrent) {
                    var current = iteration.current.value;
                    if (current.name === taskName) {
                        current.unregister(true);
                    }
                    hasCurrent = iteration.moveNext();
                }
            };
            BackgroundTaskService.prototype.registerAll = function () {
                for (var i = 0; i < this.tasks.length; i++) {
                    this.register(this.tasks[i].entryPoint, this.tasks[i].name, this.tasks[i].trigger, this.tasks[i].condition);
                }
            };
            BackgroundTaskService.prototype.unregisterAll = function () {
                for (var i = 0; i < this.tasks.length; i++) {
                    this.unregister(this.tasks[i].name);
                }
            };
            BackgroundTaskService.prototype.isRegistered = function (taskName) {
                var taskRegistered = false;
                var iteration = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
                while (iteration.hasCurrent) {
                    var task = iteration.current.value;
                    if (task.name === taskName) {
                        taskRegistered = true;
                        break;
                    }
                    iteration.moveNext();
                }
            };
            return BackgroundTaskService;
        }());
        Services.BackgroundTaskService = BackgroundTaskService;
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
        }());
        Services.ConfigService = ConfigService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var FeatureToggleService = (function () {
            function FeatureToggleService() {
                var _this = this;
                this.isWindowsApp = function () {
                    return (typeof Windows !== 'undefined');
                };
                this.isDebugMode = function () {
                    return (typeof Debug !== 'undefined');
                };
                this.isNotificationBackgroundTasksEnabled = function () {
                    return _this.isWindowsApp();
                };
                this.isSplitviewAppNameShowed = function () {
                    return false;
                };
                this.isLaunchHandled = function () {
                    return true;
                };
            }
            return FeatureToggleService;
        }());
        Services.FeatureToggleService = FeatureToggleService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var LifecycleService = (function () {
            function LifecycleService(FeatureToggleService) {
                if (!FeatureToggleService.isWindowsApp()) {
                    return;
                }
                this.app = WinJS.Application;
                this.activation = Windows.ApplicationModel.Activation;
                this.app.onactivated = function (args) {
                    if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
                        if (args.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                        }
                        else {
                        }
                        args.setPromise(WinJS.UI.processAll());
                    }
                    if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.toastNotification) {
                        var toastQuery = args.detail.argument;
                        var action = this.getQueryValue(toastQuery, 'action');
                        if (action == 'viewRoom') {
                            var roomId = this.getQueryValue(toastQuery, 'roomId');
                            if (this.ontoast) {
                                this.ontoast(action, { room: roomId });
                            }
                        }
                    }
                };
                this.app.oncheckpoint = function (args) {
                };
                this.app.start();
            }
            LifecycleService.prototype.getQueryValue = function (query, key) {
                var vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (pair[0] == key) {
                        return pair[1];
                    }
                }
            };
            return LifecycleService;
        }());
        Services.LifecycleService = LifecycleService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var LocalSettingsService = (function () {
            function LocalSettingsService(FeatureToggleService) {
                var _this = this;
                this.FeatureToggleService = FeatureToggleService;
                this.getValue = function (key) {
                    if (_this.FeatureToggleService.isWindowsApp()) {
                        return _this.localSettings.values[key];
                    }
                    else {
                    }
                };
                this.setValue = function (key, value) {
                    if (_this.FeatureToggleService.isWindowsApp()) {
                        _this.localSettings.values[key] = value;
                    }
                    else {
                    }
                };
                this.deleteValue = function (key) {
                    if (_this.FeatureToggleService.isWindowsApp()) {
                        _this.localSettings.values.remove(key);
                    }
                    else {
                    }
                };
                if (this.FeatureToggleService.isWindowsApp()) {
                    this.localSettings = Windows.Storage.ApplicationData.current.localSettings;
                }
                else {
                }
            }
            return LocalSettingsService;
        }());
        Services.LocalSettingsService = LocalSettingsService;
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
        }());
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
        }());
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
                    if (response.operation === 'create') {
                        callback(Application.Models.MessageOperation.Created, response.model);
                    }
                    else if (response.operation === 'update') {
                        var message = response.model;
                        if (message.html) {
                            callback(Application.Models.MessageOperation.Updated, response.model);
                        }
                        else {
                            callback(Application.Models.MessageOperation.Deleted, response.model);
                        }
                    }
                    else if (response.operation === 'patch') {
                        callback(Application.Models.MessageOperation.ReadBy, response.model);
                    }
                    else {
                        console.log(response);
                    }
                });
            };
            ;
            return RealtimeApiService;
        }());
        Services.RealtimeApiService = RealtimeApiService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RoomsService = (function () {
            function RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService) {
                var _this = this;
                this.OAuthService = OAuthService;
                this.NetworkService = NetworkService;
                this.ApiService = ApiService;
                this.RealtimeApiService = RealtimeApiService;
                this.ToastNotificationService = ToastNotificationService;
                this.LifecycleService = LifecycleService;
                this.initialized = false;
                this.rooms = [];
                this.NetworkService.statusChanged(function () {
                    if (!_this.initialized && _this.NetworkService.internetAvailable) {
                        _this.initialize();
                    }
                });
                this.LifecycleService.ontoast = function (action, data) {
                    if (action === 'viewRoom') {
                        var roomToView = _this.getRoomById(data.roomId);
                        _this.selectRoom(roomToView);
                    }
                };
            }
            RoomsService.prototype.addRoom = function (room) {
                var _this = this;
                if (room.user) {
                    room.image = room.user.avatarUrlMedium;
                }
                else {
                    room.image = 'https://avatars.githubusercontent.com/' + room.name.split('/')[0];
                }
                this.RealtimeApiService.subscribe(room.id, function (operation, content) {
                    if (operation === Application.Models.MessageOperation.Created) {
                        _this.receiveMessage(room, content);
                    }
                });
                this.rooms.push(room);
            };
            RoomsService.prototype.receiveMessage = function (room, message) {
                if (this.onmessagereceived) {
                    this.onmessagereceived(room.id, message);
                }
                if (message.fromUser.id === this.currentUser.id) {
                    message.unread = false;
                    return;
                }
                if (!room.lurk) {
                    room.unreadItems++;
                    this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text, 'action=viewRoom&roomId=' + room.id);
                }
                for (var i = 0; i < message.mentions.length; i++) {
                    if (message.mentions[i].userId === this.currentUser.id) {
                        room.mentions++;
                        var replyOptions = {
                            args: 'action=reply&roomId=' + room.id,
                            text: '@' + message.fromUser.username + ' ',
                            image: 'assets/icons/send.png'
                        };
                        this.ToastNotificationService.sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, 'action=viewRoom&roomId=' + room.id);
                    }
                }
            };
            RoomsService.prototype.initialize = function (callback) {
                var _this = this;
                if (this.initialized) {
                    if (callback) {
                        callback();
                        return;
                    }
                }
                if (!this.NetworkService.internetAvailable) {
                    callback();
                    return;
                }
                this.OAuthService.connect().then(function (t) {
                    console.log('Sucessfully logged to Gitter API');
                    _this.RealtimeApiService.initialize().then(function (t) {
                        console.log('Sucessfully subscribed to realtime API');
                        _this.ApiService.getCurrentUser().then(function (user) {
                            _this.currentUser = user;
                            _this.ApiService.getRooms().then(function (rooms) {
                                for (var i = 0; i < rooms.length; i++) {
                                    _this.addRoom(rooms[i]);
                                }
                                _this.initialized = true;
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    });
                });
            };
            RoomsService.prototype.getRoomById = function (id) {
                for (var i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].id === id) {
                        return this.rooms[i];
                    }
                }
            };
            RoomsService.prototype.getRoom = function (name) {
                for (var i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].name === name) {
                        return this.rooms[i];
                    }
                }
            };
            RoomsService.prototype.selectRoom = function (room) {
                this.currentRoom = room;
                if (this.onroomselected) {
                    this.onroomselected();
                }
            };
            RoomsService.prototype.createRoom = function (name, callback) {
                var _this = this;
                this.ApiService.joinRoom(name).then(function (room) {
                    _this.addRoom(room);
                    callback(room);
                });
            };
            RoomsService.prototype.createChannel = function (channel, callback) {
                var _this = this;
                this.ApiService.createChannel(channel).then(function (room) {
                    _this.addRoom(room);
                    callback(room);
                });
            };
            RoomsService.prototype.markUnreadMessages = function (messageIds) {
                var _this = this;
                this.ApiService.markUnreadMessages(this.currentUser.id, this.currentRoom.id, messageIds).then(function (response) {
                    if (response) {
                        _this.currentRoom.unreadItems -= messageIds.length;
                    }
                });
            };
            return RoomsService;
        }());
        Services.RoomsService = RoomsService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ToastNotificationService = (function () {
            function ToastNotificationService(FeatureToggleService) {
                this.FeatureToggleService = FeatureToggleService;
                if (this.FeatureToggleService.isWindowsApp()) {
                    this.toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
                }
            }
            ToastNotificationService.prototype.sendGenericToast = function (toast) {
                var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
                toastXml.loadXml(toast);
                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                this.toastNotifier.show(toastNotification);
            };
            ToastNotificationService.prototype.sendTextNotification = function (text, args) {
                if (this.FeatureToggleService.isLaunchHandled()) {
                    var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                        + '<visual>'
                        + '<binding template="ToastGeneric">'
                        + '<text></text>'
                        + '<text>' + text + '</text>'
                        + '</binding>'
                        + '</visual>'
                        + '</toast>';
                    toast = toast.replace(/&/g, '&amp;');
                    this.sendGenericToast(toast);
                }
                else {
                    var template = Windows.UI.Notifications.ToastTemplateType.toastText01;
                    var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                    var toastTextElements = toastXml.getElementsByTagName('text');
                    toastTextElements[0].appendChild(toastXml.createTextNode(text));
                    var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                    this.toastNotifier.show(toastNotification);
                }
            };
            ToastNotificationService.prototype.sendTitleAndTextNotification = function (title, text, args) {
                if (this.FeatureToggleService.isLaunchHandled()) {
                    var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                        + '<visual>'
                        + '<binding template="ToastGeneric">'
                        + '<text>' + title + '</text>'
                        + '<text>' + text + '</text>'
                        + '</binding>'
                        + '</visual>'
                        + '</toast>';
                    toast = toast.replace(/&/g, '&amp;');
                    this.sendGenericToast(toast);
                }
                else {
                    var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
                    var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                    var toastTextElements = toastXml.getElementsByTagName('text');
                    toastTextElements[0].appendChild(toastXml.createTextNode(title));
                    toastTextElements[1].appendChild(toastXml.createTextNode(text));
                    var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                    this.toastNotifier.show(toastNotification);
                }
            };
            ToastNotificationService.prototype.sendImageAndTextNotification = function (image, text, args) {
                if (this.FeatureToggleService.isLaunchHandled()) {
                    var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                        + '<visual>'
                        + '<binding template="ToastGeneric">'
                        + '<image placement="appLogoOverride" src="' + image + '" />'
                        + '<text></text>'
                        + '<text>' + text + '</text>'
                        + '</binding>'
                        + '</visual>'
                        + '</toast>';
                    toast = toast.replace(/&/g, '&amp;');
                    this.sendGenericToast(toast);
                }
                else {
                    var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText01;
                    var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                    var toastImageElements = toastXml.getElementsByTagName('image');
                    toastImageElements[0].setAttribute('src', image);
                    var toastTextElements = toastXml.getElementsByTagName('text');
                    toastTextElements[0].appendChild(toastXml.createTextNode(text));
                    var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                    this.toastNotifier.show(toastNotification);
                }
            };
            ToastNotificationService.prototype.sendImageTitleAndTextNotification = function (image, title, text, args) {
                if (this.FeatureToggleService.isLaunchHandled()) {
                    var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
                        + '<visual>'
                        + '<binding template="ToastGeneric">'
                        + '<image placement="appLogoOverride" src="' + image + '" />'
                        + '<text>' + title + '</text>'
                        + '<text>' + text + '</text>'
                        + '</binding>'
                        + '</visual>'
                        + '</toast>';
                    toast = toast.replace(/&/g, '&amp;');
                    this.sendGenericToast(toast);
                }
                else {
                    var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
                    var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                    var toastImageElements = toastXml.getElementsByTagName('image');
                    toastImageElements[0].setAttribute('src', image);
                    var toastTextElements = toastXml.getElementsByTagName('text');
                    toastTextElements[0].appendChild(toastXml.createTextNode(title));
                    toastTextElements[1].appendChild(toastXml.createTextNode(text));
                    var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                    this.toastNotifier.show(toastNotification);
                }
            };
            ToastNotificationService.prototype.sendImageTitleAndTextNotificationWithReply = function (image, title, text, replyOptions, args) {
                if (this.FeatureToggleService.isLaunchHandled()) {
                    var toast = (args ? '<toast launch="' + args + '">' : '<toast>')
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
                    this.sendGenericToast(toast);
                }
            };
            return ToastNotificationService;
        }());
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
        }());
        Directives.NgEnter = NgEnter;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        var MessageList = (function () {
            function MessageList(_, $timeout, $location, ApiService, RoomsService) {
                var _this = this;
                this._ = _;
                this.$timeout = $timeout;
                this.$location = $location;
                this.ApiService = ApiService;
                this.RoomsService = RoomsService;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = 'partials/message-list.html';
                this.link = function (scope, element, attrs) {
                    var angularElement = angular.element(element);
                    scope.autoScrollDown = true;
                    var initialize = function () {
                        _this.RoomsService.onmessagereceived = function (roomId, message) {
                            if (scope.room && scope.room.id === roomId) {
                                scope.messages.push(message);
                            }
                        };
                        _this.ApiService.getMessages(scope.room.id).then(function (messages) {
                            scope.messages = [];
                            for (var i = 0; i < messages.length; i++) {
                                scope.messages.push(messages[i]);
                            }
                        });
                        _this.$timeout(function () {
                            scrollToBottom();
                            scope.canLoadMoreMessages = true;
                        }, 1000);
                        angularElement.bind("scroll", _this._.debounce(watchScroll, 100));
                    };
                    var fetchPreviousMessages = function () {
                        if (!scope.canLoadMoreMessages)
                            return;
                        var olderMessage = scope.messages[0];
                        _this.ApiService.getMessages(scope.room.id, olderMessage.id).then(function (beforeMessages) {
                            if (!beforeMessages || beforeMessages.length <= 0) {
                                scope.canLoadMoreMessages = false;
                                return;
                            }
                            for (var i = beforeMessages.length - 1; i >= 0; i--) {
                                scope.messages.unshift(beforeMessages[i]);
                            }
                            _this.$location.hash('message-' + olderMessage.id);
                        });
                    };
                    var detectUnreadMessages = function () {
                        var topOfScrollview = angularElement[0].scrollTop;
                        var bottomOfScrollview = angularElement[0].scrollTop + angularElement[0].offsetHeight;
                        var topOfMessageElement = 0;
                        var messageIds = [];
                        for (var i = 0; i < scope.messages.length; i++) {
                            var message = scope.messages[i];
                            var messageElement = document.getElementById('message-' + message.id);
                            if (!messageElement)
                                continue;
                            if (message.unread) {
                                var bottomOfMessageElement = topOfMessageElement + messageElement.offsetHeight;
                                if (bottomOfMessageElement >= topOfScrollview && topOfMessageElement <= bottomOfScrollview) {
                                    messageIds.push(message.id);
                                    message.unread = false;
                                }
                            }
                            topOfMessageElement += messageElement.offsetHeight;
                        }
                        if (messageIds.length > 0) {
                            _this.RoomsService.markUnreadMessages(messageIds);
                        }
                    };
                    var scrollToBottom = function () {
                        angularElement[0].scrollTop = angularElement[0].scrollHeight;
                    };
                    var hasScrollReachedBottom = function () {
                        return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= angularElement[0].scrollHeight;
                    };
                    var hasScrollReachedNearBottom = function () {
                        return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= (angularElement[0].scrollHeight - 50);
                    };
                    var hasScrollReachedTop = function () {
                        return angularElement[0].scrollTop === 0;
                    };
                    var hasScrollReachedNearTop = function () {
                        return angularElement[0].scrollTop <= 150;
                    };
                    var watchScroll = function () {
                        scope.autoScrollDown = hasScrollReachedNearBottom();
                        if (hasScrollReachedNearTop()) {
                            fetchPreviousMessages();
                        }
                        detectUnreadMessages();
                    };
                    initialize();
                };
            }
            return MessageList;
        }());
        Directives.MessageList = MessageList;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AboutCtrl = (function () {
            function AboutCtrl($scope, FeatureToggleService) {
                if (FeatureToggleService.isWindowsApp()) {
                    var currentPackage = Windows.ApplicationModel.Package.current;
                    var packageVersion = currentPackage.id.version;
                    $scope.appVersion = packageVersion.major + '.' + packageVersion.minor + '.' + packageVersion.build;
                }
                else {
                    $scope.appVersion = 'web';
                }
            }
            return AboutCtrl;
        }());
        Controllers.AboutCtrl = AboutCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddChannelRoomCtrl = (function () {
            function AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService) {
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
                $scope.channel = new Application.Models.NewChannel();
                $scope.selectOwner = function (owner) {
                    $scope.channel.owner = owner;
                };
                $scope.createRoom = function () {
                    RoomsService.createChannel($scope.channel, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'The channel ' + room.name + ' has been successfully created', 'action=viewRoom&roomId=' + room.id);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
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
                        $scope.$digest();
                    });
                });
            }
            return AddChannelRoomCtrl;
        }());
        Controllers.AddChannelRoomCtrl = AddChannelRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddExistingRoomCtrl = (function () {
            function AddExistingRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService) {
                $scope.roomname = '';
                $scope.existingRooms = [];
                $scope.selection = [];
                $scope.createRoom = function () {
                    var selectedRoom = $scope.existingRooms[$scope.selection[0]];
                    RoomsService.createRoom(selectedRoom.uri, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name, 'action=viewRoom&roomId=' + room.id);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                $scope.$watch('roomname', function () {
                    if ($scope.roomname && $scope.roomname.length > 0) {
                        ApiService.searchRooms($scope.roomname, 50).then(function (rooms) {
                            $scope.existingRooms = rooms;
                            for (var i = 0; i < $scope.existingRooms.length; i++) {
                                if ($scope.existingRooms[i].user) {
                                    $scope.existingRooms[i].image = $scope.existingRooms[i].user.avatarUrlMedium;
                                }
                                else {
                                    $scope.existingRooms[i].image = "https://avatars.githubusercontent.com/" + $scope.existingRooms[i].name.split('/')[0];
                                }
                            }
                            $scope.$digest();
                        });
                    }
                });
            }
            return AddExistingRoomCtrl;
        }());
        Controllers.AddExistingRoomCtrl = AddExistingRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddOneToOneRoomCtrl = (function () {
            function AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService) {
                $scope.username = '';
                $scope.users = [];
                $scope.selection = [];
                $scope.createRoom = function () {
                    var selectedUser = $scope.users[$scope.selection[0]];
                    RoomsService.createRoom(selectedUser.username, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'You can now chat with ' + room.name, 'action=viewRoom&roomId=' + room.id);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                $scope.$watch('username', function () {
                    if ($scope.username && $scope.username.length > 0) {
                        ApiService.searchUsers($scope.username, 50).then(function (users) {
                            $scope.users = users;
                            $scope.$digest();
                        });
                    }
                });
            }
            return AddOneToOneRoomCtrl;
        }());
        Controllers.AddOneToOneRoomCtrl = AddOneToOneRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddRepositoryRoomCtrl = (function () {
            function AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
                $scope.selection = [];
                $scope.createRoom = function () {
                    var repository = $scope.repositoriesWithoutRoom[$scope.selection[0]];
                    RoomsService.createRoom(repository.uri, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'The room ' + room.name + ' has been successfully created', 'action=viewRoom&roomId=' + room.id);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                ApiService.getCurrentUser().then(function (user) {
                    ApiService.getRepositories(user.id).then(function (repositories) {
                        $scope.repositories = repositories;
                        $scope.$digest();
                    });
                });
                $scope.$watch('repositories', function () {
                    $scope.repositoriesWithoutRoom = $filter('filter')($scope.repositories, { exists: false });
                }, true);
            }
            return AddRepositoryRoomCtrl;
        }());
        Controllers.AddRepositoryRoomCtrl = AddRepositoryRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AddRoomCtrl = (function () {
            function AddRoomCtrl($scope, $state) {
                $scope.currentView = 'existing';
                $scope.$watch(function () {
                    return $state.current.name;
                }, function () {
                    var stateName = $state.current.name;
                    $scope.currentView = stateName.substring(stateName.indexOf('.') + 1);
                });
            }
            return AddRoomCtrl;
        }());
        Controllers.AddRoomCtrl = AddRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AppCtrl = (function () {
            function AppCtrl($scope, $rootScope, FeatureToggleService) {
                var _this = this;
                this.invertCssClass = function (oldClass, newCLass) {
                    var elements = document.getElementsByClassName(oldClass);
                    for (var i in elements) {
                        if (elements.hasOwnProperty(i)) {
                            elements[i].className = newCLass;
                        }
                    }
                };
                $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                    if (!from.name || to.name === 'splashscreen') {
                        _this.invertCssClass('win-splitview-pane', 'win-splitview-pane-hidden');
                    }
                    else {
                        _this.invertCssClass('win-splitview-pane-hidden', 'win-splitview-pane');
                    }
                });
            }
            return AppCtrl;
        }());
        Controllers.AppCtrl = AppCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ChatCtrl = (function () {
            function ChatCtrl($scope, ApiService, RoomsService, LocalSettingsService) {
                $scope.room = RoomsService.currentRoom;
                $scope.messages = [];
                $scope.textMessage = '';
                $scope.sendingMessage = false;
                $scope.canLoadMoreMessages = false;
                $scope.sendMessage = function () {
                    if ($scope.sendingMessage) {
                        return;
                    }
                    if ($scope.textMessage) {
                        $scope.sendingMessage = true;
                        ApiService.sendMessage($scope.room.id, $scope.textMessage).then(function (message) {
                            $scope.textMessage = '';
                            $scope.$apply();
                            $scope.sendingMessage = false;
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
                LocalSettingsService.setValue('lastPage', 'chat');
                LocalSettingsService.setValue('lastRoom', $scope.room.name);
            }
            return ChatCtrl;
        }());
        Controllers.ChatCtrl = ChatCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ErrorCtrl = (function () {
            function ErrorCtrl($scope) {
            }
            return ErrorCtrl;
        }());
        Controllers.ErrorCtrl = ErrorCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, $state, RoomsService, ToastNotificationService) {
                $scope.chatWithUs = function () {
                    var roomName = 'Odonno/Modern-Gitter';
                    for (var i = 0; i < RoomsService.rooms.length; i++) {
                        if (RoomsService.rooms[i].name === roomName) {
                            RoomsService.selectRoom(RoomsService.rooms[i]);
                            $state.go('chat');
                            return;
                        }
                    }
                    RoomsService.createRoom(roomName, function (room) {
                        ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name, 'action=viewRoom&roomId=' + room.id);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
            }
            return HomeCtrl;
        }());
        Controllers.HomeCtrl = HomeCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var RoomsCtrl = (function () {
            function RoomsCtrl($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService) {
                LocalSettingsService.setValue('lastPage', 'rooms');
                $scope.rooms = RoomsService.rooms;
                $scope.selectRoom = function (room) {
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                };
                $scope.$watchGroup(['rooms', 'search'], function () {
                    $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
                    $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
                });
            }
            return RoomsCtrl;
        }());
        Controllers.RoomsCtrl = RoomsCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var SplashscreenCtrl = (function () {
            function SplashscreenCtrl($scope, $state, RoomsService, LocalSettingsService, BackgroundTaskService, FeatureToggleService) {
                RoomsService.initialize(function () {
                    var lastPage = LocalSettingsService.getValue('lastPage');
                    var lastRoom = LocalSettingsService.getValue('lastRoom');
                    if (lastPage === 'chat' && lastRoom) {
                        RoomsService.onroomselected = function () {
                            $state.go('chat');
                        };
                        var room = RoomsService.getRoom(lastRoom);
                        RoomsService.selectRoom(room);
                    }
                    else if (lastPage === 'rooms') {
                        $state.go('rooms');
                    }
                    else {
                        $state.go('home');
                    }
                    if (FeatureToggleService.isNotificationBackgroundTasksEnabled()) {
                        var lastVersion = LocalSettingsService.getValue('backgroundTaskVersion');
                        if (!lastVersion || lastVersion !== BackgroundTaskService.currentVersion) {
                            BackgroundTaskService.unregisterAll();
                            BackgroundTaskService.registerAll();
                            LocalSettingsService.setValue('backgroundTaskVersion', BackgroundTaskService.currentVersion);
                        }
                    }
                });
            }
            return SplashscreenCtrl;
        }());
        Controllers.SplashscreenCtrl = SplashscreenCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var appModule = angular.module('modern-gitter', ['ngSanitize', 'ui.router', 'yaru22.angular-timeago', 'emoji']);
appModule.constant('_', window._);
appModule.config(function ($stateProvider, $urlRouterProvider) { return new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider); });
appModule.run(function ($rootScope, $state, RoomsService, FeatureToggleService) { return new Application.Configs.NavigationConfig($rootScope, $state, RoomsService, FeatureToggleService); });
appModule.service('ApiService', function (ConfigService, OAuthService) { return new Application.Services.ApiService(ConfigService, OAuthService); });
appModule.service('BackgroundTaskService', function (FeatureToggleService) { return new Application.Services.BackgroundTaskService(FeatureToggleService); });
appModule.service('ConfigService', function () { return new Application.Services.ConfigService(); });
appModule.service('FeatureToggleService', function () { return new Application.Services.FeatureToggleService(); });
appModule.service('LifecycleService', function (FeatureToggleService) { return new Application.Services.LifecycleService(FeatureToggleService); });
appModule.service('LocalSettingsService', function (FeatureToggleService) { return new Application.Services.LocalSettingsService(FeatureToggleService); });
appModule.service('NetworkService', function (FeatureToggleService) { return new Application.Services.NetworkService(FeatureToggleService); });
appModule.service('OAuthService', function (ConfigService) { return new Application.Services.OAuthService(ConfigService); });
appModule.service('RealtimeApiService', function (OAuthService) { return new Application.Services.RealtimeApiService(OAuthService); });
appModule.service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService) { return new Application.Services.RoomsService(OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService); });
appModule.service('ToastNotificationService', function (FeatureToggleService) { return new Application.Services.ToastNotificationService(FeatureToggleService); });
appModule.directive('ngEnter', function () { return new Application.Directives.NgEnter(); });
appModule.directive('messageList', function (_, $timeout, $location, ApiService, RoomsService) { return new Application.Directives.MessageList(_, $timeout, $location, ApiService, RoomsService); });
appModule.controller('AboutCtrl', function ($scope, FeatureToggleService) { return new Application.Controllers.AboutCtrl($scope, FeatureToggleService); });
appModule.controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddExistingRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddExistingRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddOneToOneRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRepositoryRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRoomCtrl', function ($scope, $state) { return new Application.Controllers.AddRoomCtrl($scope, $state); });
appModule.controller('AppCtrl', function ($scope, $rootScope, FeatureToggleService) { return new Application.Controllers.AppCtrl($scope, $rootScope, FeatureToggleService); });
appModule.controller('ChatCtrl', function ($scope, ApiService, RoomsService, LocalSettingsService) { return new Application.Controllers.ChatCtrl($scope, ApiService, RoomsService, LocalSettingsService); });
appModule.controller('ErrorCtrl', function ($scope) { return new Application.Controllers.ErrorCtrl($scope); });
appModule.controller('HomeCtrl', function ($scope, $state, RoomsService, ToastNotificationService) { return new Application.Controllers.HomeCtrl($scope, $state, RoomsService, ToastNotificationService); });
appModule.controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService) { return new Application.Controllers.RoomsCtrl($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService); });
appModule.controller('SplashscreenCtrl', function ($scope, $state, RoomsService, LocalSettingsService, BackgroundTaskService, FeatureToggleService) { return new Application.Controllers.SplashscreenCtrl($scope, $state, RoomsService, LocalSettingsService, BackgroundTaskService, FeatureToggleService); });
