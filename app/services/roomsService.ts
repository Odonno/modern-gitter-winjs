/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RoomsService {
        // properties
        public initialized = false;
        public currentUser: any;
        public currentRoom: any;
        public rooms = [];
        public onroomselected: any;
        public onmessagereceived: any;

        constructor(private OAuthService: Application.Services.OAuthService, private NetworkService: Application.Services.NetworkService, private ApiService: Application.Services.ApiService, private RealtimeApiService: Application.Services.RealtimeApiService, private ToastNotificationService: Application.Services.ToastNotificationService) {
            // check when internet status changed
            this.NetworkService.statusChanged(() => {
                if (!this.initialized && this.NetworkService.internetAvailable) {
                    this.initialize();
                }
            });
        }

        // private methods
        private addRoom(room) {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
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

            if (message.fromUser.id !== this.currentUser.id) {
                // increment unread count
                room.unreadItems++;
                
                // send notification
                this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text, 'action=viewRoom&amp;roomId=' + room.id);
            } else {
                message.unread = false;
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
                            for (var i = 0; i < rooms.length; i++) {
                                this.addRoom(rooms[i]);
                            }
                            this.initialized = true;
                            if (callback) {
                                callback();
                            }
                        });
                    });
                });
            });
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