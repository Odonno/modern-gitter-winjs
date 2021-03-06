﻿var Application;
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
            function NavigationConfig($rootScope, $state, RoomsService, NetworkService, NavigationService, FeatureToggleService) {
                var _this = this;
                $rootScope.states = [];
                $rootScope.isBack = false;
                if (FeatureToggleService.isWindowsApp()) {
                    this._systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                }
                NetworkService.statusChanged(function (networkStatus) {
                    $rootScope.onnetworkstatuschanged(networkStatus);
                });
                $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                    $rootScope.currentState = to.name;
                    $rootScope.currentParams = toParams;
                    $rootScope.onnetworkstatuschanged(NetworkService.internetAvailable);
                    if (!from.name || from.name === 'splashscreen') {
                        return;
                    }
                    if ($rootScope.isBack) {
                        $rootScope.isBack = false;
                        return;
                    }
                    NavigationService.onnavigate(from, fromParams, NetworkService.internetAvailable);
                });
                if (FeatureToggleService.isWindowsApp()) {
                    this._systemNavigationManager.onbackrequested = function (args) {
                        if ($rootScope.states.length > 0) {
                            NavigationService.goBack();
                            args.handled = true;
                        }
                        else {
                            _this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                        }
                    };
                }
                $rootScope.onnetworkstatuschanged = function (networkStatus) {
                    if (networkStatus) {
                        if ($rootScope.currentState === 'error' && $rootScope.currentParams.errorType === 'network') {
                            NavigationService.goBack();
                        }
                    }
                    else {
                        if ($rootScope.currentState !== 'error') {
                            $state.go('error', { errorType: 'network' });
                        }
                    }
                };
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
                    controller: 'ErrorCtrl',
                    params: {
                        errorType: null
                    }
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
                    .state('settings', {
                    url: '/settings',
                    templateUrl: 'partials/settings.html',
                    controller: 'SettingsCtrl'
                })
                    .state('addRoom', {
                    abstract: true,
                    url: '/addRoom',
                    templateUrl: 'partials/addRoom.html',
                    controller: 'AddRoomCtrl'
                })
                    .state('addRoom.suggested', {
                    url: '/suggested',
                    templateUrl: 'partials/addRoom/suggested.html',
                    controller: 'AddSuggestedRoomCtrl'
                })
                    .state('addRoom.existing', {
                    url: '/existing',
                    templateUrl: 'partials/addRoom/existing.html',
                    controller: 'AddExistingRoomCtrl'
                })
                    .state('addRoom.repository', {
                    url: '/repository',
                    templateUrl: 'partials/addRoom/repository.html',
                    controller: 'AddRepositoryRoomCtrl'
                })
                    .state('addRoom.channel', {
                    url: '/channel',
                    templateUrl: 'partials/addRoom/channel.html',
                    controller: 'AddChannelRoomCtrl'
                })
                    .state('addRoom.oneToOne', {
                    url: '/oneToOne',
                    templateUrl: 'partials/addRoom/oneToOne.html',
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
            ApiService.prototype.getSuggestedRooms = function () {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'GET',
                        url: _this.ConfigService.baseUrl + "user/me/suggestedRooms",
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
            ApiService.prototype.updateRoom = function (userId, room) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'PUT',
                        url: _this.ConfigService.baseUrl + "user/" + userId + "/rooms/" + room.id,
                        data: JSON.stringify(room),
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
            ApiService.prototype.leaveRoom = function (roomId, userId) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'DELETE',
                        url: _this.ConfigService.baseUrl + "rooms/" + roomId + "/users/" + userId,
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
            ApiService.prototype.updateMessage = function (roomId, messageId, text) {
                var _this = this;
                return new Promise(function (done, error) {
                    WinJS.xhr({
                        type: 'PUT',
                        url: _this.ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages/" + messageId,
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
                this.currentVersion = 'v0.8';
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
            function FeatureToggleService($injector) {
                this.$injector = $injector;
            }
            FeatureToggleService.prototype.inject = function () {
                if (!this._localSettingsService) {
                    this._localSettingsService = this.$injector.get('LocalSettingsService');
                }
            };
            FeatureToggleService.prototype.isWindowsApp = function () {
                return (typeof Windows !== 'undefined');
            };
            ;
            FeatureToggleService.prototype.isDebugMode = function () {
                if (this.isWindowsApp()) {
                    var thisPackage = Windows.ApplicationModel.Package.current;
                    var installedPath = thisPackage.installedLocation.path;
                    if (typeof installedPath === "string") {
                        if (installedPath.match(/\\debug\\appx$/i)) {
                            return true;
                        }
                    }
                    return false;
                }
                else {
                    return true;
                }
            };
            ;
            FeatureToggleService.prototype.isNotificationBackgroundTasksEnabled = function () {
                return this.isWindowsApp();
            };
            ;
            FeatureToggleService.prototype.useFeedbackHubApp = function () {
                if (this.isWindowsApp()) {
                    return (Microsoft.Services.Store.Engagement.Feedback.IsSupported);
                }
                else {
                    return false;
                }
            };
            ;
            FeatureToggleService.prototype.isRunningWindowsMobile = function () {
                if (this.isWindowsApp()) {
                    return (Windows.System.Profile.AnalyticsInfo.versionInfo.deviceFamily === "Windows.Mobile");
                }
                else {
                    return false;
                }
            };
            ;
            FeatureToggleService.prototype.isSignOutHandled = function () {
                return true;
            };
            ;
            FeatureToggleService.prototype.isBetaVersionEnabled = function () {
                this.inject();
                if (this._localSettingsService.contains('isBetaVersionEnabled')) {
                    return this._localSettingsService.get('isBetaVersionEnabled');
                }
                else {
                    return false;
                }
            };
            ;
            FeatureToggleService.prototype.isLineReturnShouldSendChatMessage = function () {
                this.inject();
                if (this._localSettingsService.contains('isLineReturnShouldSendChatMessage')) {
                    return this._localSettingsService.get('isLineReturnShouldSendChatMessage');
                }
                else {
                    return !this.isRunningWindowsMobile();
                }
            };
            ;
            FeatureToggleService.prototype.isUnreadItemsNotificationsEnabled = function () {
                this.inject();
                if (this._localSettingsService.contains('isUnreadItemsNotificationsEnabled')) {
                    return this._localSettingsService.get('isUnreadItemsNotificationsEnabled');
                }
                else {
                    return true;
                }
            };
            ;
            FeatureToggleService.prototype.isUnreadMentionsNotificationsEnabled = function () {
                this.inject();
                if (this._localSettingsService.contains('isUnreadMentionsNotificationsEnabled')) {
                    return this._localSettingsService.get('isUnreadMentionsNotificationsEnabled');
                }
                else {
                    return true;
                }
            };
            ;
            FeatureToggleService.prototype.isNewMessageNotificationEnabled = function () {
                this.inject();
                if (this._localSettingsService.contains('isNewMessageNotificationEnabled')) {
                    return this._localSettingsService.get('isNewMessageNotificationEnabled');
                }
                else {
                    return true;
                }
            };
            ;
            FeatureToggleService.prototype.$get = function () {
                return {
                    isWindowsApp: this.isWindowsApp,
                    isDebugMode: this.isDebugMode,
                    isNotificationBackgroundTasksEnabled: this.isNotificationBackgroundTasksEnabled,
                    useFeedbackHubApp: this.useFeedbackHubApp,
                    isRunningWindowsMobile: this.isRunningWindowsMobile,
                    isSignOutHandled: this.isSignOutHandled
                };
            };
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
            function LifecycleService(FeatureToggleService, LocalSettingsService) {
                var _this = this;
                if (!FeatureToggleService.isWindowsApp()) {
                    return;
                }
                WinJS.Application.onactivated = function (args) {
                    if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
                        if (args.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                        }
                        else {
                        }
                    }
                    if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.toastNotification) {
                        var toastQuery = args.detail.argument;
                        var action = _this.getQueryValue(toastQuery, 'action');
                        if (action == 'viewRoom') {
                            LocalSettingsService.remove('lastPage');
                            var roomId = _this.getQueryValue(toastQuery, 'roomId');
                            if (_this.ontoast) {
                                _this.ontoast(action, { roomId: roomId });
                            }
                        }
                    }
                    args.setPromise(WinJS.UI.processAll());
                };
                WinJS.Application.oncheckpoint = function (args) {
                };
                WinJS.Application.start();
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
                this.FeatureToggleService = FeatureToggleService;
                if (this.FeatureToggleService.isWindowsApp()) {
                    this.localSettings = Windows.Storage.ApplicationData.current.localSettings;
                }
                else {
                }
            }
            LocalSettingsService.prototype.contains = function (key) {
                if (this.FeatureToggleService.isWindowsApp()) {
                    return this.localSettings.values.hasKey(key);
                }
                else {
                }
            };
            LocalSettingsService.prototype.get = function (key) {
                if (this.FeatureToggleService.isWindowsApp()) {
                    return this.localSettings.values[key];
                }
                else {
                }
            };
            ;
            LocalSettingsService.prototype.set = function (key, value) {
                if (this.FeatureToggleService.isWindowsApp()) {
                    this.localSettings.values[key] = value;
                }
                else {
                }
            };
            ;
            LocalSettingsService.prototype.remove = function (key) {
                if (this.FeatureToggleService.isWindowsApp()) {
                    this.localSettings.values.remove(key);
                }
                else {
                }
            };
            ;
            return LocalSettingsService;
        }());
        Services.LocalSettingsService = LocalSettingsService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var NavigationService = (function () {
            function NavigationService($rootScope, $state, RoomsService, FeatureToggleService) {
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.RoomsService = RoomsService;
                this.FeatureToggleService = FeatureToggleService;
                if (this.FeatureToggleService.isWindowsApp()) {
                    this._systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                }
            }
            NavigationService.prototype.onnavigate = function (fromState, fromParams, canGoBack) {
                if (canGoBack === void 0) { canGoBack = true; }
                this.$rootScope.previousState = fromState.name;
                if (this.FeatureToggleService.isWindowsApp()) {
                    if (canGoBack) {
                        this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
                    }
                    else {
                        this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                    }
                }
                this.$rootScope.states.push({
                    state: this.$rootScope.previousState,
                    params: fromParams
                });
            };
            NavigationService.prototype.goBack = function () {
                if (this.$rootScope.states.length === 0) {
                    return;
                }
                this.$rootScope.isBack = true;
                var previous = this.$rootScope.states.pop();
                while (previous.state === 'chat' && !this.RoomsService.currentRoom) {
                    previous = this.$rootScope.states.pop();
                }
                this.$state.go(previous.state, previous.params);
                if (this.FeatureToggleService.isWindowsApp()) {
                    if (this.$rootScope.states.length === 0) {
                        this._systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                    }
                }
            };
            return NavigationService;
        }());
        Services.NavigationService = NavigationService;
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
                    if (!internetConnectionProfile) {
                        this.internetAvailable = false;
                    }
                    else {
                        var networkConnectivityLevel = internetConnectionProfile.getNetworkConnectivityLevel();
                        this.internetAvailable = (networkConnectivityLevel === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess);
                    }
                }
                else {
                    this.internetAvailable = true;
                }
                return this.internetAvailable;
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
                this.refreshToken = this.retrieveTokenFromVault();
            }
            OAuthService.prototype.connect = function () {
                var _this = this;
                return new Promise(function (done, error) {
                    if (!_this.refreshToken) {
                        _this.authenticate()
                            .then(function (token) { return _this.grant(token)
                            .then(function (accessToken) {
                            var credentials = new Windows.Security.Credentials.PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                            var passwordVault = new Windows.Security.Credentials.PasswordVault();
                            passwordVault.add(credentials);
                            _this.refreshToken = accessToken.access_token;
                            done(_this.refreshToken);
                        }); });
                    }
                    else {
                        done(_this.refreshToken);
                    }
                });
            };
            ;
            OAuthService.prototype.disconnect = function () {
                var passwordVault = new Windows.Security.Credentials.PasswordVault();
                var credential = passwordVault.retrieve("OauthToken", "CurrentUser");
                passwordVault.remove(credential);
                this.refreshToken = undefined;
            };
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
                        authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, requestUri, callbackUri)
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
            RealtimeApiService.prototype.unsubscribe = function (roomId) {
                this.client.unsubscribe('/api/v1/rooms/' + roomId + '/chatMessages');
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
            function RoomsService($state, $timeout, OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService, FeatureToggleService) {
                var _this = this;
                this.OAuthService = OAuthService;
                this.NetworkService = NetworkService;
                this.ApiService = ApiService;
                this.RealtimeApiService = RealtimeApiService;
                this.ToastNotificationService = ToastNotificationService;
                this.LifecycleService = LifecycleService;
                this.FeatureToggleService = FeatureToggleService;
                this.loggedIn = false;
                this.rooms = [];
                this.NetworkService.statusChanged(function () {
                    if (!_this.loggedIn && _this.NetworkService.internetAvailable) {
                        _this.logIn();
                    }
                });
                this.LifecycleService.ontoast = function (action, data) {
                    if (!_this.loggedIn) {
                        $timeout(function () { return _this.LifecycleService.ontoast(action, data); }, 200);
                    }
                    else {
                        if (action === 'viewRoom') {
                            var room = _this.getRoomById(data.roomId);
                            _this.selectRoom(room);
                            $state.go('chat');
                        }
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
            RoomsService.prototype.removeRoom = function (room) {
                var index = this.rooms.indexOf(room);
                if (index >= 0) {
                    this.rooms.splice(index, 1);
                    return true;
                }
                return false;
            };
            RoomsService.prototype.receiveMessage = function (room, message) {
                if (this.onmessagereceived) {
                    this.onmessagereceived(room.id, message);
                }
                if (message.fromUser.id === this.currentUser.id) {
                    message.unread = false;
                    return;
                }
                this.notifyNewUnreadMessage(room, message);
                this.notifyNewUnreadMentions(room, message);
            };
            RoomsService.prototype.notifyNewUnreadMessage = function (room, message) {
                if (!room.lurk) {
                    room.unreadItems++;
                    if (this.FeatureToggleService.isNewMessageNotificationEnabled()) {
                        this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, "New message - " + room.name, message.text, { launch: "action=viewRoom&roomId=" + room.id });
                    }
                }
            };
            RoomsService.prototype.notifyNewUnreadMentions = function (room, message) {
                for (var i = 0; i < message.mentions.length; i++) {
                    if (message.mentions[i].userId == this.currentUser.id) {
                        room.mentions++;
                        if (this.FeatureToggleService.isNewMessageNotificationEnabled()) {
                            var replyOptions = {
                                id: 'message',
                                type: 'text',
                                content: 'Send',
                                placeHolderContent: 'Type a reply',
                                arguments: "action=reply&roomId=" + room.id,
                                defaultInput: "@" + message.fromUser.username + " ",
                                image: 'assets/icons/send.png',
                                activationType: 'background'
                            };
                            this.ToastNotificationService.sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, { launch: "action=viewRoom&roomId=" + room.id });
                        }
                    }
                }
            };
            RoomsService.prototype.logIn = function (callback) {
                var _this = this;
                if (this.loggedIn) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                if (!this.NetworkService.internetAvailable) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                this.OAuthService.connect().then(function (t) {
                    console.log('Sucessfully logged to Gitter API');
                    _this.RealtimeApiService.initialize().then(function (t) {
                        console.log('Sucessfully subscribed to realtime API');
                        _this.ApiService.getCurrentUser().then(function (user) {
                            console.log('Sucessfully logged in');
                            _this.currentUser = user;
                            _this.refreshRooms(function () {
                                _this.loggedIn = true;
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    });
                });
            };
            RoomsService.prototype.reset = function () {
                for (var i = 0; i < this.rooms.length; i++) {
                    this.RealtimeApiService.unsubscribe(this.rooms[i].id);
                }
                this.currentUser = undefined;
                this.rooms = [];
                this.currentRoom = undefined;
                this.loggedIn = false;
            };
            RoomsService.prototype.refreshRooms = function (callback) {
                var _this = this;
                for (var i = 0; i < this.rooms.length; i++) {
                    this.RealtimeApiService.unsubscribe(this.rooms[i].id);
                }
                this.currentRoom = undefined;
                this.rooms = [];
                this.ApiService.getRooms().then(function (rooms) {
                    for (var i_1 = 0; i_1 < rooms.length; i_1++) {
                        _this.addRoom(rooms[i_1]);
                    }
                    if (callback) {
                        callback();
                    }
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
            RoomsService.prototype.canJoin = function (name) {
                return !this.getRoom(name);
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
            RoomsService.prototype.leaveRoom = function (room, callback) {
                var _this = this;
                this.ApiService.leaveRoom(room.id, this.currentUser.id).then(function () {
                    callback();
                    _this.removeRoom(room);
                });
            };
            RoomsService.prototype.deleteRoom = function (room, callback) {
                var _this = this;
                this.ApiService.deleteRoom(room.id).then(function () {
                    callback();
                    _this.removeRoom(room);
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
            ToastNotificationService.prototype.encodeLaunchArg = function (launch) {
                return launch.replace(/&/g, '&amp;');
            };
            ToastNotificationService.prototype.encodeImageArg = function (image) {
                return image.replace(/&/g, '&amp;');
            };
            ToastNotificationService.prototype.encodeTextNotification = function (text) {
                return text.replace('<', '&lt;').replace('>', '&gt;');
            };
            ToastNotificationService.prototype.send = function (toast, args) {
                var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
                toastXml.loadXml(toast);
                var toastNotification = new Windows.UI.Notifications.ToastNotification(toastXml);
                if (args) {
                    if (args.tag) {
                        toastNotification.tag = args.tag;
                    }
                    if (args.group) {
                        toastNotification.group = args.group;
                    }
                    if (args.expirationTime) {
                        var expiration = new Date();
                        expiration.setSeconds(expiration.getSeconds() + args.expirationTime);
                        toastNotification.expirationTime = expiration;
                    }
                }
                this.toastNotifier.show(toastNotification);
            };
            ToastNotificationService.prototype.sendTextNotification = function (text, toastOptions) {
                var toastArgs = '';
                if (toastOptions) {
                    toastArgs += (toastOptions.launch ? " launch=\"" + this.encodeLaunchArg(toastOptions.launch) + "\"" : '');
                }
                var toast = '<toast' + toastArgs + '>'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text></text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                this.send(toast, toastOptions);
            };
            ToastNotificationService.prototype.sendTitleAndTextNotification = function (title, text, toastOptions) {
                var toastArgs = '';
                if (toastOptions) {
                    toastArgs += (toastOptions.launch ? " launch=\"" + this.encodeLaunchArg(toastOptions.launch) + "\"" : '');
                }
                var toast = '<toast' + toastArgs + '>'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                this.send(toast, toastOptions);
            };
            ToastNotificationService.prototype.sendImageAndTextNotification = function (image, text, toastOptions) {
                var toastArgs = '';
                if (toastOptions) {
                    toastArgs += (toastOptions.launch ? " launch=\"" + this.encodeLaunchArg(toastOptions.launch) + "\"" : '');
                }
                var toast = '<toast' + toastArgs + '>'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + this.encodeImageArg(image) + '" />'
                    + '<text></text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                this.send(toast, toastOptions);
            };
            ToastNotificationService.prototype.sendImageTitleAndTextNotification = function (image, title, text, toastOptions) {
                var toastArgs = '';
                if (toastOptions) {
                    toastArgs += (toastOptions.launch ? " launch=\"" + this.encodeLaunchArg(toastOptions.launch) + "\"" : '');
                }
                var toast = '<toast' + toastArgs + '>'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + this.encodeImageArg(image) + '" />'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '</toast>';
                this.send(toast, toastOptions);
            };
            ToastNotificationService.prototype.sendImageTitleAndTextNotificationWithReply = function (image, title, text, replyOptions, toastOptions) {
                var toastArgs = '';
                if (toastOptions) {
                    toastArgs += (toastOptions.launch ? " launch=\"" + this.encodeLaunchArg(toastOptions.launch) + "\"" : '');
                }
                var toast = '<toast' + toastArgs + '>'
                    + '<visual>'
                    + '<binding template="ToastGeneric">'
                    + '<image placement="appLogoOverride" src="' + this.encodeImageArg(image) + '" />'
                    + '<text>' + this.encodeTextNotification(title) + '</text>'
                    + '<text>' + this.encodeTextNotification(text) + '</text>'
                    + '</binding>'
                    + '</visual>'
                    + '<actions>'
                    + '<input id="' + replyOptions.id + '" type="' + replyOptions.type + '" placeHolderContent="' + replyOptions.placeHolderContent + '" defaultInput="' + this.encodeTextNotification(replyOptions.defaultInput) + '" />'
                    + '<action content="' + replyOptions.content + '" imageUri="' + this.encodeImageArg(replyOptions.image) + '" hint-inputId="' + replyOptions.id + '" activationType="' + replyOptions.activationType + '" arguments="' + this.encodeLaunchArg(replyOptions.arguments) + '" />'
                    + '</actions>'
                    + '</toast>';
                this.send(toast, toastOptions);
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
                            if (attrs['noLineReturn'] == 'true') {
                                event.preventDefault();
                            }
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
        var NgEscape = (function () {
            function NgEscape() {
                this.link = function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 27) {
                            scope.$apply(function () {
                                scope.$eval(attrs['ngEscape']);
                            });
                            event.preventDefault();
                        }
                    });
                };
            }
            return NgEscape;
        }());
        Directives.NgEscape = NgEscape;
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
                this.templateUrl = 'partials/directives/message-list.html';
                this.link = function (scope, element, attrs) {
                    var angularElement = angular.element(element);
                    scope.autoScrollDown = true;
                    scope.canLoadMoreMessages = false;
                    scope.fetchingPreviousMessages = false;
                    var initialize = function () {
                        _this.RoomsService.onmessagereceived = function (roomId, message) {
                            if (scope.room && scope.room.id === roomId) {
                                scope.messages.push(message);
                                if (scope.autoScrollDown) {
                                    var refreshCount_1 = 5;
                                    var timer_1 = setInterval(function () {
                                        scrollToBottom();
                                        if (--refreshCount_1 <= 0) {
                                            clearInterval(timer_1);
                                        }
                                    }, 200);
                                }
                                refreshFlyouts();
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
                        angularElement.bind("scroll", _this._.throttle(watchScroll, 200));
                        refreshFlyouts();
                    };
                    var fetchPreviousMessages = function () {
                        if (!scope.canLoadMoreMessages)
                            return;
                        var olderMessage = scope.messages[0];
                        if (!olderMessage) {
                            scope.canLoadMoreMessages = false;
                            return;
                        }
                        if (scope.fetchingPreviousMessages)
                            return;
                        scope.fetchingPreviousMessages = true;
                        _this.ApiService.getMessages(scope.room.id, olderMessage.id).then(function (beforeMessages) {
                            if (!beforeMessages || beforeMessages.length <= 0) {
                                scope.canLoadMoreMessages = false;
                                return;
                            }
                            for (var i = beforeMessages.length - 1; i >= 0; i--) {
                                scope.messages.unshift(beforeMessages[i]);
                            }
                            _this.$location.hash('message-' + olderMessage.id);
                            scope.fetchingPreviousMessages = false;
                            refreshFlyouts();
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
                    var refreshFlyouts = function () {
                        _this.$timeout(function () {
                            WinJS.UI.processAll().done(function () {
                                var menu = document.getElementById("messageMenu").winControl;
                                var anchors = document.getElementsByClassName("message-subcontainer");
                                angular.forEach(anchors, function (anchor) {
                                    anchor.onclick = function (e) {
                                        var messageId = anchor.getAttribute('data-message-id');
                                        var canEditMessage = scope.canEdit(messageId);
                                        menu.showAt(e);
                                        var replyMenuCommand = document.getElementById("replyMenuCommand");
                                        replyMenuCommand.onclick = function () {
                                            scope.reply(messageId);
                                        };
                                        var quoteMenuCommand = document.getElementById("quoteMenuCommand");
                                        quoteMenuCommand.onclick = function () {
                                            scope.quote(messageId);
                                        };
                                        var editMenuCommand = document.getElementById("editMenuCommand");
                                        editMenuCommand.onclick = function () {
                                            scope.startEdit(messageId);
                                        };
                                        var deleteMenuCommand = document.getElementById("deleteMenuCommand");
                                        deleteMenuCommand.onclick = function () {
                                            scope.delete(messageId);
                                        };
                                        if (!canEditMessage) {
                                            editMenuCommand.setAttribute("disabled", "disabled");
                                            deleteMenuCommand.setAttribute("disabled", "disabled");
                                        }
                                        else {
                                            editMenuCommand.removeAttribute("disabled");
                                            deleteMenuCommand.removeAttribute("disabled");
                                        }
                                    };
                                });
                            });
                        }, 1000);
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
                        var toastOptions = {
                            launch: "action=viewRoom&roomId=" + room.id,
                            expirationTime: 5
                        };
                        ToastNotificationService.sendImageAndTextNotification(room.image, "The channel " + room.name + " has been successfully created", toastOptions);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                $scope.owners.push({
                    id: RoomsService.currentUser.id,
                    name: RoomsService.currentUser.username,
                    image: RoomsService.currentUser.avatarUrlSmall,
                    org: false
                });
                ApiService.getOrganizations(RoomsService.currentUser.id)
                    .then(function (orgs) {
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
                $scope.search = '';
                $scope.existingRooms = [];
                $scope.selectRoom = function (room) {
                    $scope.selectedRoom = room;
                    $scope.canJoin = RoomsService.canJoin($scope.selectedRoom.name);
                };
                $scope.joinRoom = function () {
                    RoomsService.createRoom($scope.selectedRoom.uri, function (room) {
                        var toastOptions = {
                            launch: "action=viewRoom&roomId=" + room.id,
                            expirationTime: 5
                        };
                        ToastNotificationService.sendImageAndTextNotification(room.image, "You joined the room " + room.name, toastOptions);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                $scope.$watch('search', function () {
                    if ($scope.search && $scope.search.length > 0) {
                        ApiService.searchRooms($scope.search, 50)
                            .then(function (rooms) {
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
                $scope.search = '';
                $scope.users = [];
                $scope.selectUser = function (user) {
                    $scope.selectedUser = user;
                    $scope.canJoin = RoomsService.canJoin($scope.selectedUser.displayName);
                };
                $scope.createRoom = function () {
                    RoomsService.createRoom($scope.selectedUser.username, function (room) {
                        var toastOptions = {
                            launch: "action=viewRoom&roomId=" + room.id,
                            expirationTime: 5
                        };
                        ToastNotificationService.sendImageAndTextNotification(room.image, "You can now chat with " + room.name, toastOptions);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                $scope.$watch('search', function () {
                    if ($scope.search && $scope.search.length > 0) {
                        ApiService.searchUsers($scope.search, 50)
                            .then(function (users) {
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
                $scope.selectRepository = function (repository) {
                    $scope.selectedRepository = repository;
                    $scope.canJoin = RoomsService.canJoin($scope.selectedRepository.uri);
                };
                $scope.createRoom = function () {
                    RoomsService.createRoom($scope.selectedRepository.uri, function (room) {
                        var toastOptions = {
                            launch: "action=viewRoom&roomId=" + room.id,
                            expirationTime: 5
                        };
                        ToastNotificationService.sendImageAndTextNotification(room.image, "The room " + room.name + " has been successfully created", toastOptions);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                ApiService.getRepositories(RoomsService.currentUser.id)
                    .then(function (repositories) {
                    $scope.repositories = repositories;
                    $scope.$digest();
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
                $scope.currentView = 'suggested';
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
        var AddSuggestedRoomCtrl = (function () {
            function AddSuggestedRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) {
                $scope.selectRepository = function (repository) {
                    $scope.selectedRepository = repository;
                    $scope.canJoin = RoomsService.canJoin($scope.selectedRepository.uri);
                };
                $scope.createRoom = function () {
                    RoomsService.createRoom($scope.selectedRepository.uri, function (room) {
                        var toastOptions = {
                            launch: "action=viewRoom&roomId=" + room.id,
                            expirationTime: 5
                        };
                        ToastNotificationService.sendImageAndTextNotification(room.image, "The room " + room.name + " has been successfully created", toastOptions);
                        RoomsService.selectRoom(room);
                        $state.go('chat');
                    });
                };
                ApiService.getSuggestedRooms()
                    .then(function (repositories) {
                    $scope.suggestions = repositories;
                    $scope.$digest();
                });
            }
            return AddSuggestedRoomCtrl;
        }());
        Controllers.AddSuggestedRoomCtrl = AddSuggestedRoomCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var AppCtrl = (function () {
            function AppCtrl($scope, $rootScope, $state, RoomsService, OAuthService, LocalSettingsService, BackgroundTaskService, FeatureToggleService) {
                var _this = this;
                this.invertCssClass = function (oldClass, newCLass) {
                    var elements = document.getElementsByClassName(oldClass);
                    for (var i in elements) {
                        if (elements.hasOwnProperty(i)) {
                            elements[i].className = newCLass;
                        }
                    }
                };
                $scope.loggedIn = RoomsService.loggedIn;
                $scope.isSignOutHandled = FeatureToggleService.isSignOutHandled();
                $scope.betaVersionEnabled = FeatureToggleService.isBetaVersionEnabled();
                $scope.tryLogin = function () {
                    RoomsService.logIn(function () {
                        $scope.loggedIn = RoomsService.loggedIn;
                        var lastPage = LocalSettingsService.get('lastPage');
                        var lastRoom = LocalSettingsService.get('lastRoom');
                        if (lastPage === 'chat' && lastRoom) {
                            RoomsService.onroomselected = function () {
                                $state.go(lastPage);
                            };
                            var room = RoomsService.getRoom(lastRoom);
                            RoomsService.selectRoom(room);
                        }
                        else if (lastPage === 'rooms') {
                            $state.go(lastPage);
                        }
                        else {
                            $state.go('home');
                        }
                    });
                };
                $scope.logout = function () {
                    if (FeatureToggleService.isSignOutHandled()) {
                        LocalSettingsService.remove('lastPage');
                        LocalSettingsService.remove('lastRoom');
                        $state.go('home');
                        OAuthService.disconnect();
                        RoomsService.reset();
                        $scope.loggedIn = RoomsService.loggedIn;
                        console.log('Succesfully logged out');
                    }
                };
                $scope.tryLogin();
                if (FeatureToggleService.isNotificationBackgroundTasksEnabled()) {
                    var lastVersion = LocalSettingsService.get('backgroundTaskVersion');
                    if (!lastVersion || lastVersion !== BackgroundTaskService.currentVersion) {
                        BackgroundTaskService.unregisterAll();
                        BackgroundTaskService.registerAll();
                        LocalSettingsService.set('backgroundTaskVersion', BackgroundTaskService.currentVersion);
                    }
                }
                $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                    if (!from.name || to.name === 'splashscreen') {
                        _this.invertCssClass('win-splitview-pane', 'win-splitview-pane-hidden');
                    }
                    else {
                        _this.invertCssClass('win-splitview-pane-hidden', 'win-splitview-pane');
                        if (FeatureToggleService.isRunningWindowsMobile()) {
                            var splitView = document.querySelector(".splitView").winControl;
                            splitView.paneOpened = false;
                        }
                    }
                });
                $rootScope.$on('updateSetting', function () {
                    $scope.betaVersionEnabled = FeatureToggleService.isBetaVersionEnabled();
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
            function ChatCtrl($scope, $state, ApiService, RoomsService, NavigationService, LocalSettingsService, ToastNotificationService, FeatureToggleService) {
                if (!RoomsService.currentRoom) {
                    console.error('no room selected...');
                    $state.go('error', { errorType: 'noRoomSelected' });
                    return;
                }
                $scope.isLineReturnShouldSendChatMessage = FeatureToggleService.isLineReturnShouldSendChatMessage();
                $scope.room = RoomsService.currentRoom;
                $scope.messages = [];
                $scope.textMessage = '';
                $scope.sendingMessage = false;
                $scope.leaveRoom = function () {
                    RoomsService.leaveRoom($scope.room, function () {
                        console.log('leaving room');
                        LocalSettingsService.remove('lastPage');
                        LocalSettingsService.remove('lastRoom');
                        $state.go('rooms');
                    });
                };
                $scope.deleteRoom = function () {
                    RoomsService.deleteRoom($scope.room, function () {
                        console.log('deleting room');
                        LocalSettingsService.remove('lastPage');
                        LocalSettingsService.remove('lastRoom');
                        $state.go('rooms');
                    });
                };
                $scope.toggleFavourite = function (callback) {
                    if ($scope.room.favourite) {
                        $scope.room.favourite = 0;
                    }
                    else {
                        $scope.room.favourite = 1;
                    }
                    ApiService.updateRoom(RoomsService.currentUser.id, $scope.room)
                        .then(function (result) {
                        callback();
                    });
                };
                $scope.getMessageById = function (id) {
                    for (var i = 0; i < $scope.messages.length; i++) {
                        if ($scope.messages[i].id == id) {
                            return $scope.messages[i];
                        }
                    }
                };
                $scope.reply = function (messageId) {
                    var message = $scope.getMessageById(messageId);
                    if (message) {
                        $scope.textMessage += "@" + message.fromUser.username + " ";
                    }
                };
                $scope.quote = function (messageId) {
                    var message = $scope.getMessageById(messageId);
                    if (message) {
                        $scope.textMessage += "> " + message.text;
                    }
                };
                $scope.canEdit = function (messageId) {
                    var message = $scope.getMessageById(messageId);
                    var isMyMessage = RoomsService.currentUser.id == message.fromUser.id;
                    var minutesSent = Math.abs(new Date() - new Date(message.sent)) / 1000 / 60;
                    return (isMyMessage && minutesSent < 10);
                };
                $scope.startEdit = function (messageId) {
                    var message = $scope.getMessageById(messageId);
                    $scope.editedText = message.text;
                    $scope.editedMessage = message;
                    console.log('edition started');
                };
                $scope.stopEdit = function () {
                    $scope.editedMessage = undefined;
                    $scope.editedText = '';
                    console.log('edition stopped');
                };
                $scope.completeEdit = function () {
                    if ($scope.editedText) {
                        console.log($scope.editedText);
                        ApiService.updateMessage($scope.room.id, $scope.editedMessage.id, $scope.editedText)
                            .then(function (updatedMessage) {
                            console.log(updatedMessage);
                            $scope.editedMessage.editedAt = updatedMessage.editedAt;
                            $scope.editedMessage.html = updatedMessage.html;
                            $scope.editedMessage.text = updatedMessage.text;
                            $scope.editedMessage = undefined;
                            $scope.editedText = '';
                            console.log('edition completed');
                        });
                    }
                };
                $scope.delete = function (messageId) {
                    var message = $scope.getMessageById(messageId);
                    ApiService.updateMessage($scope.room.id, messageId, '')
                        .then(function (updatedMessage) {
                        message.editedAt = updatedMessage.editedAt;
                        message.html = updatedMessage.html;
                        message.text = updatedMessage.text;
                        console.log('message deleted');
                    });
                };
                $scope.returnLine = function () {
                    if (FeatureToggleService.isLineReturnShouldSendChatMessage()) {
                        $scope.sendMessage();
                    }
                };
                $scope.sendMessage = function () {
                    if ($scope.sendingMessage) {
                        return;
                    }
                    if ($scope.textMessage) {
                        $scope.sendingMessage = true;
                        ApiService.sendMessage($scope.room.id, $scope.textMessage).then(function (message) {
                            $scope.textMessage = '';
                            $scope.sendingMessage = false;
                            $scope.$apply();
                        });
                    }
                    else {
                        console.error('textMessage is empty');
                    }
                };
                LocalSettingsService.set('lastPage', 'chat');
                LocalSettingsService.set('lastRoom', $scope.room.name);
                if (FeatureToggleService.isDebugMode() && false) {
                    var toastOptions = {
                        launch: "action=viewRoom&roomId=" + $scope.room.id
                    };
                    ToastNotificationService.sendImageTitleAndTextNotification($scope.room.image, 'Title of notification', 'A message with a < or a >', toastOptions);
                    var username = 'gitter-bot';
                    var replyOptions = {
                        id: 'message',
                        type: 'text',
                        content: 'Send',
                        placeHolderContent: 'Type a reply',
                        arguments: "action=reply&roomId=" + $scope.room.id,
                        defaultInput: "@" + username + " ",
                        image: 'assets/icons/send.png',
                        activationType: 'background'
                    };
                    ToastNotificationService.sendImageTitleAndTextNotificationWithReply($scope.room.image, username + " mentioned you", 'This is a test message, please respond', replyOptions, toastOptions);
                }
                WinJS.UI.processAll().done(function () {
                    var cmdLeave = document.getElementById('cmdLeave');
                    cmdLeave.className += $scope.room.oneToOne ? ' hide' : ' show';
                    cmdLeave.onclick = function () {
                        $scope.leaveRoom();
                    };
                    var cmdDelete = document.getElementById('cmdDelete');
                    cmdDelete.className += $scope.room.oneToOne ? ' show' : ' hide';
                    cmdDelete.onclick = function () {
                        $scope.deleteRoom();
                    };
                    var cmdFavourite = document.getElementById('cmdFavourite');
                    cmdFavourite.setAttribute('aria-checked', $scope.room.favourite ? 'true' : 'false');
                    cmdFavourite.onclick = function () {
                        $scope.toggleFavourite(function () {
                            cmdFavourite.setAttribute('aria-checked', $scope.room.favourite ? 'true' : 'false');
                        });
                    };
                });
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
            function ErrorCtrl($scope, $state) {
                $scope.errorType = $state.params['errorType'];
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
                        ToastNotificationService.sendImageAndTextNotification(room.image, "You joined the room " + room.name, { launch: "action=viewRoom&roomId=" + room.id });
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
                LocalSettingsService.set('lastPage', 'rooms');
                $scope.rooms = RoomsService.rooms;
                $scope.refresh = function () {
                    RoomsService.refreshRooms();
                    console.log('rooms refreshed');
                };
                $scope.selectRoom = function (room) {
                    RoomsService.selectRoom(room);
                    $state.go('chat');
                };
                $scope.$watchGroup(['rooms', 'search'], function () {
                    $scope.filteredRooms = $filter('filter')($scope.rooms, { name: $scope.search });
                    $scope.filteredRooms = $filter('orderBy')($scope.filteredRooms, ['favourite', '-unreadItems', '-lastAccessTime']);
                });
                WinJS.UI.processAll().done(function () {
                    var searchInput = document.getElementById('searchInput');
                    searchInput.onkeyup = function () {
                        $scope.search = searchInput.value;
                        $scope.$apply();
                    };
                    var cmdRefresh = document.getElementById('cmdRefresh');
                    cmdRefresh.onclick = function () {
                        $scope.refresh();
                    };
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
        var SettingsCtrl = (function () {
            function SettingsCtrl($scope, $rootScope, LocalSettingsService, FeatureToggleService) {
                $scope.isBetaVersionEnabled = FeatureToggleService.isBetaVersionEnabled();
                $scope.isLineReturnShouldSendChatMessage = FeatureToggleService.isLineReturnShouldSendChatMessage();
                $scope.isUnreadItemsNotificationsEnabled = FeatureToggleService.isUnreadItemsNotificationsEnabled();
                $scope.isUnreadMentionsNotificationsEnabled = FeatureToggleService.isUnreadMentionsNotificationsEnabled();
                $scope.isNewMessageNotificationEnabled = FeatureToggleService.isNewMessageNotificationEnabled();
                $scope.saveSetting = function (property) {
                    if (LocalSettingsService.contains(property)) {
                        var lastValue = LocalSettingsService.get(property);
                        LocalSettingsService.set(property, !lastValue);
                    }
                    else {
                        LocalSettingsService.set(property, !$scope[property]);
                    }
                    $rootScope.$emit('updateSetting');
                };
            }
            return SettingsCtrl;
        }());
        Controllers.SettingsCtrl = SettingsCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var SplashscreenCtrl = (function () {
            function SplashscreenCtrl($scope) {
            }
            return SplashscreenCtrl;
        }());
        Controllers.SplashscreenCtrl = SplashscreenCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var appModule = angular.module('modern-gitter', ['ngSanitize', 'ui.router', 'yaru22.angular-timeago', 'emoji']);
appModule.constant('_', window['_']);
appModule.provider('FeatureToggle', function ($injector) { return new Application.Services.FeatureToggleService($injector); });
appModule.config(function ($stateProvider, $urlRouterProvider) { return new Application.Configs.RoutingConfig($stateProvider, $urlRouterProvider); });
appModule.run(function ($rootScope, $state, RoomsService, NetworkService, NavigationService, FeatureToggleService) { return new Application.Configs.NavigationConfig($rootScope, $state, RoomsService, NetworkService, NavigationService, FeatureToggleService); });
appModule.service('ApiService', function (ConfigService, OAuthService) { return new Application.Services.ApiService(ConfigService, OAuthService); });
appModule.service('BackgroundTaskService', function (FeatureToggleService) { return new Application.Services.BackgroundTaskService(FeatureToggleService); });
appModule.service('ConfigService', function () { return new Application.Services.ConfigService(); });
appModule.service('FeatureToggleService', function ($injector) { return new Application.Services.FeatureToggleService($injector); });
appModule.service('LifecycleService', function (FeatureToggleService, LocalSettingsService) { return new Application.Services.LifecycleService(FeatureToggleService, LocalSettingsService); });
appModule.service('LocalSettingsService', function (FeatureToggleService) { return new Application.Services.LocalSettingsService(FeatureToggleService); });
appModule.service('NavigationService', function ($rootScope, $state, RoomsService, FeatureToggleService) { return new Application.Services.NavigationService($rootScope, $state, RoomsService, FeatureToggleService); });
appModule.service('NetworkService', function (FeatureToggleService) { return new Application.Services.NetworkService(FeatureToggleService); });
appModule.service('OAuthService', function (ConfigService) { return new Application.Services.OAuthService(ConfigService); });
appModule.service('RealtimeApiService', function (OAuthService) { return new Application.Services.RealtimeApiService(OAuthService); });
appModule.service('RoomsService', function ($state, $timeout, OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService, FeatureToggleService) { return new Application.Services.RoomsService($state, $timeout, OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService, LifecycleService, FeatureToggleService); });
appModule.service('ToastNotificationService', function (FeatureToggleService) { return new Application.Services.ToastNotificationService(FeatureToggleService); });
appModule.directive('ngEnter', function () { return new Application.Directives.NgEnter(); });
appModule.directive('ngEscape', function () { return new Application.Directives.NgEscape(); });
appModule.directive('messageList', function (_, $timeout, $location, ApiService, RoomsService) { return new Application.Directives.MessageList(_, $timeout, $location, ApiService, RoomsService); });
appModule.controller('AboutCtrl', function ($scope, FeatureToggleService) { return new Application.Controllers.AboutCtrl($scope, FeatureToggleService); });
appModule.controller('AddChannelRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddChannelRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddExistingRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddExistingRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddOneToOneRoomCtrl', function ($scope, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddOneToOneRoomCtrl($scope, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRepositoryRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddRepositoryRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AddRoomCtrl', function ($scope, $state) { return new Application.Controllers.AddRoomCtrl($scope, $state); });
appModule.controller('AddSuggestedRoomCtrl', function ($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService) { return new Application.Controllers.AddSuggestedRoomCtrl($scope, $filter, $state, ApiService, RoomsService, ToastNotificationService); });
appModule.controller('AppCtrl', function ($scope, $rootScope, $state, RoomsService, OAuthService, LocalSettingsService, BackgroundTaskService, FeatureToggleService) { return new Application.Controllers.AppCtrl($scope, $rootScope, $state, RoomsService, OAuthService, LocalSettingsService, BackgroundTaskService, FeatureToggleService); });
appModule.controller('ChatCtrl', function ($scope, $state, ApiService, RoomsService, NavigationService, LocalSettingsService, ToastNotificationService, FeatureToggleService) { return new Application.Controllers.ChatCtrl($scope, $state, ApiService, RoomsService, NavigationService, LocalSettingsService, ToastNotificationService, FeatureToggleService); });
appModule.controller('ErrorCtrl', function ($scope, $state) { return new Application.Controllers.ErrorCtrl($scope, $state); });
appModule.controller('HomeCtrl', function ($scope, $state, RoomsService, ToastNotificationService) { return new Application.Controllers.HomeCtrl($scope, $state, RoomsService, ToastNotificationService); });
appModule.controller('RoomsCtrl', function ($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService) { return new Application.Controllers.RoomsCtrl($scope, $filter, $state, RoomsService, LocalSettingsService, FeatureToggleService); });
appModule.controller('SettingsCtrl', function ($scope, $rootScope, LocalSettingsService, FeatureToggleService) { return new Application.Controllers.SettingsCtrl($scope, $rootScope, LocalSettingsService, FeatureToggleService); });
appModule.controller('SplashscreenCtrl', function ($scope) { return new Application.Controllers.SplashscreenCtrl($scope); });
