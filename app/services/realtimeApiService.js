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