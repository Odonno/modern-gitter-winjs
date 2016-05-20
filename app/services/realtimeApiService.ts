/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RealtimeApiService {
        private client: any;

        constructor(private OAuthService: OAuthService) {
        }

        public initialize(): Promise<any> {
            return new Promise((done, error) => {
                let ClientAuthExt = () => { };

                ClientAuthExt.prototype.outgoing = (message, callback) => {
                    if (message.channel == '/meta/handshake') {
                        if (!message.ext) {
                            message.ext = {};
                        }
                        message.ext.token = this.OAuthService.refreshToken;
                    }

                    callback(message);
                };

                ClientAuthExt.prototype.incoming = (message, callback) => {
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

        public subscribe(roomId: string, callback: { (messageOperation: Models.MessageOperation, model: any): void }) {
            // subscribe to realtime messages
            this.client.subscribe('/api/v1/rooms/' + roomId + '/chatMessages', (response) => {
                if (response.operation === 'create') {
                    // new message
                    callback(Models.MessageOperation.Created, response.model);
                } else if (response.operation === 'update') {
                    let message = response.model;
                    if (message.html) {
                        // message updated
                        callback(Models.MessageOperation.Updated, response.model);
                    } else {
                        // message deleted
                        callback(Models.MessageOperation.Deleted, response.model);
                    }
                } else if (response.operation === 'patch') {
                    // readby event
                    callback(Models.MessageOperation.ReadBy, response.model);
                } else {
                    console.log(response);
                }
            });
        };

        public unsubscribe(roomId: string) {
            // unsubscribe from realtime messages
            this.client.unsubscribe('/api/v1/rooms/' + roomId + '/chatMessages');
        };
    }
}