/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ApiService {
        constructor(private ConfigService: ConfigService, private OAuthService: OAuthService) {
        }

        public getRooms() {
            return new Promise<Models.Room[]>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "rooms",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public joinRoom(name: string) {
            return new Promise<Models.Room>((done, error) => {
                WinJS.xhr({
                    type: 'POST',
                    url: this.ConfigService.baseUrl + "rooms",
                    data: JSON.stringify({ uri: name }),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public createChannel(channel: Models.NewChannel) {
            return new Promise<Models.Room>((done, error) => {
                if (channel.owner.org) {
                    WinJS.xhr({
                        type: 'POST',
                        url: this.ConfigService.baseUrl + "private/channels/",
                        data: JSON.stringify({
                            name: channel.name,
                            security: channel.permission.toUpperCase(),
                            ownerUri: channel.owner.name
                        }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + this.OAuthService.refreshToken
                        }
                    }).then((success) => {
                        done(JSON.parse(success.response));
                    });
                } else {
                    WinJS.xhr({
                        type: 'POST',
                        url: this.ConfigService.baseUrl + "user/" + channel.owner.id + "/channels",
                        data: JSON.stringify({
                            name: channel.name,
                            security: channel.permission.toUpperCase()
                        }),
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + this.OAuthService.refreshToken
                        }
                    }).then((success) => {
                        done(JSON.parse(success.response));
                    });
                }
            });
        };

        public deleteRoom(roomId: string) {
            return new Promise<{}>((done, error) => {
                WinJS.xhr({
                    type: 'DELETE',
                    url: this.ConfigService.baseUrl + "rooms/" + roomId,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public getMessages(roomId: string, beforeId?: string) {
            return new Promise<Models.Message[]>((done, error) => {
                let query = '?limit=' + this.ConfigService.messagesLimit;

                if (beforeId) {
                    query += '&beforeId=' + beforeId;
                }

                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages" + query,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public sendMessage(roomId: string, text: string) {
            return new Promise<Models.Message>((done, error) => {
                WinJS.xhr({
                    type: 'POST',
                    url: this.ConfigService.baseUrl + "rooms/" + roomId + "/chatMessages",
                    data: JSON.stringify({ text: text }),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public markUnreadMessages(userId: string, roomId: string, messageIds: string[]) {
            return new Promise<{}>((done, error) => {
                WinJS.xhr({
                    type: 'POST',
                    url: this.ConfigService.baseUrl + "user/" + userId + "/rooms/" + roomId + "/unreadItems",
                    data: JSON.stringify({ chat: messageIds }),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public getCurrentUser() {
            return new Promise<Models.User>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "user/",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response)[0]);
                });
            });
        };

        public getOrganizations(userId: string) {
            return new Promise<Models.Org[]>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "user/" + userId + "/orgs",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public getRepositories(userId: string) {
            return new Promise<Models.Repository[]>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "user/" + userId + "/repos",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response));
                });
            });
        };

        public searchRooms(query: string, limit: number) {
            return new Promise<Models.Room[]>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "rooms?q=" + query + "&limit=" + limit,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response).results);
                });
            });
        };

        public searchUsers(query: string, limit: number) {
            return new Promise<Models.User[]>((done, error) => {
                WinJS.xhr({
                    type: 'GET',
                    url: this.ConfigService.baseUrl + "user?q=" + query + "&limit=" + limit + "&type=gitter",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.OAuthService.refreshToken
                    }
                }).then((success) => {
                    done(JSON.parse(success.response).results);
                });
            });
        };
    }
}