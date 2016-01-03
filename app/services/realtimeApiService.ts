/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RealtimeApiService {
        private client: any;

        constructor(private OAuthService: Application.Services.OAuthService) {
        }

        public initialize() {
            return new Promise((done, error) => {
                var ClientAuthExt = function() { };

                ClientAuthExt.prototype.outgoing = function(message, callback) {
                    if (message.channel == '/meta/handshake') {
                        if (!message.ext) {
                            message.ext = {};
                        }
                        message.ext.token = this.OAuthService.refreshToken;
                    }

                    callback(message);
                };

                ClientAuthExt.prototype.incoming = function(message, callback) {
                    if (message.channel == '/meta/handshake') {
                        if (message.successful) {
                            console.log('Successfuly subscribed');
                        } else {
                            console.log('Something went wrong: ', message.error);
                        }
                    }

                    callback(message);
                };

                this.client = new Faye.Client('https://ws.gitter.im/faye', { timeout: 60, retry: 5, interval: 1 });
                this.client.addExtension(new ClientAuthExt());

                done();
            });
        };

        public subscribe(roomId, callback) {
            // subscribe to realtime messages
            this.client.subscribe('/api/v1/rooms/' + roomId + '/chatMessages', function(response) {
                var message = response.model;
                callback(roomId, message);
            });
        };
    }
}