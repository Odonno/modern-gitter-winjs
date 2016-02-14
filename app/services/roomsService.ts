/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RoomsService {
        // properties
        public initialized = false;
        public currentUser: any;
        public currentRoom: any;
        public rooms = [];
        public onroomselected: { (): void; };
        public onmessagereceived: { (roomId: string, message: any): void; };

        constructor(private OAuthService: Application.Services.OAuthService, private NetworkService: Application.Services.NetworkService, private ApiService: Application.Services.ApiService, private RealtimeApiService: Application.Services.RealtimeApiService, private ToastNotificationService: Application.Services.ToastNotificationService, private LifecycleService: Application.Services.LifecycleService) {
            // check when internet status changed
            this.NetworkService.statusChanged(() => {
                if (!this.initialized && this.NetworkService.internetAvailable) {
                    this.initialize();
                }
            });

            // detect when we received a toast action
            this.LifecycleService.ontoast = (action, data) => {
                if (action === 'viewRoom') {
                    var roomToView = this.getRoomById(data.roomId);
                    this.selectRoom(roomToView);
                }
            };
        }

        // private methods
        private addRoom(room) {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = 'https://avatars.githubusercontent.com/' + room.name.split('/')[0];
            }
                
            // subscribe to realtime messages
            this.RealtimeApiService.subscribe(room.id, (operation: Application.Models.MessageOperation, content: any) => {
                if (operation === Application.Models.MessageOperation.Created) {
                    this.receiveMessage(room, content);
                }
            });

            this.rooms.push(room);
        }

        private receiveMessage(room, message) {
            if (this.onmessagereceived) {
                this.onmessagereceived(room.id, message);
            }
            
            // no notification if it's our own message
            if (message.fromUser.id === this.currentUser.id) {
                message.unread = false;
                return;
            }
            
            // push unread message
            if (!room.lurk) {
                // increment unread count
                room.unreadItems++;
                
                // send notification
                this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text, 'action=viewRoom&roomId=' + room.id);
            }
            
            // for each mention contained in the message
            for (var i = 0; i < message.mentions.length; i++) {
                // push mention (count + notification)
                if (message.mentions[i].userId === this.currentUser.id) {
                    // increment mentions count
                    room.mentions++;
                
                    // send notification
                    var replyOptions = {
                        args: 'action=reply&roomId=' + room.id,
                        text: '@' + message.fromUser.username + ' ',
                        image: 'assets/icons/send.png'
                    };
                    this.ToastNotificationService.sendImageTitleAndTextNotificationWithReply(room.image, message.fromUser.username + " mentioned you", message.text, replyOptions, 'action=viewRoom&roomId=' + room.id);
                }
            }
        }

        // public methods
        public initialize(callback?) {
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

            this.OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                this.RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    this.ApiService.getCurrentUser().then(user => {
                        this.currentUser = user;

                        this.ApiService.getRooms().then(rooms => {
                            // import all rooms from API
                            for (var i = 0; i < rooms.length; i++) {
                                this.addRoom(rooms[i]);
                            }
                            
                            // service is now initialized
                            this.initialized = true;
                            if (callback) {
                                callback();
                            }
                        });
                    });
                });
            });
        }

        public getRoomById(id: string) {
            for (var i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].id === id) {
                    return this.rooms[i];
                }
            }
        }

        public getRoom(name: string) {
            for (var i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].name === name) {
                    return this.rooms[i];
                }
            }
        }

        public selectRoom(room) {
            this.currentRoom = room;
            if (this.onroomselected) {
                this.onroomselected();
            }
        }

        public createRoom(name, callback) {
            this.ApiService.joinRoom(name).then(room => {
                this.addRoom(room);
                callback(room);
            });
        }

        public createChannel(channel, callback) {
            this.ApiService.createChannel(channel).then(room => {
                this.addRoom(room);
                callback(room);
            });
        }

        public markUnreadMessages(messageIds: string[]) {
            this.ApiService.markUnreadMessages(this.currentUser.id, this.currentRoom.id, messageIds).then(response => {
                if (response) {
                    this.currentRoom.unreadItems -= messageIds.length;
                }
            });
        }
    }
}