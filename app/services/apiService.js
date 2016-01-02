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
        
        apiService.deleteRoom = function(roomId) {
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
        
        apiService.getCurrentUser = function() {
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
        
        apiService.getRepositories = function(userId) {
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
        
        apiService.searchUsers = function(query, limit) {
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