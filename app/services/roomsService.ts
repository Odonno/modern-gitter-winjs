/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RoomsService {
        // properties
        public loggedIn = false;
        public currentUser: Models.User;
        public rooms: Models.Room[] = [];
        public currentRoom: Models.Room;
        public onroomselected: { (): void; };
        public onmessagereceived: { (roomId: string, message: Models.Message): void; };

        constructor($state: ng.ui.IStateService, $timeout: ng.ITimeoutService, private OAuthService: OAuthService, private NetworkService: NetworkService, private ApiService: ApiService, private RealtimeApiService: RealtimeApiService, private ToastNotificationService: ToastNotificationService, private LifecycleService: LifecycleService, private FeatureToggleService: FeatureToggleService) {
            // check when internet status changed
            this.NetworkService.statusChanged(() => {
                if (!this.loggedIn && this.NetworkService.internetAvailable) {
                    this.logIn();
                }
            });

            // detect when we received a toast action
            this.LifecycleService.ontoast = (action, data) => {
                if (!this.loggedIn) {
                    $timeout(() => this.LifecycleService.ontoast(action, data), 200);
                } else {
                    // execute viewRoom action
                    if (action === 'viewRoom') {
                        let room = this.getRoomById(data.roomId);
                        this.selectRoom(room);
                        $state.go('chat');
                    }
                }
            };
        }

        // private methods
        private addRoom(room: Models.Room): void {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = 'https://avatars.githubusercontent.com/' + room.name.split('/')[0];
            }

            // subscribe to realtime messages
            this.RealtimeApiService.subscribe(room.id, (operation: Models.MessageOperation, content: any) => {
                if (operation === Models.MessageOperation.Created) {
                    this.receiveMessage(room, content);
                }
            });

            this.rooms.push(room);
        }

        private removeRoom(room: Models.Room): boolean {
            // remove room from the list
            var index = this.rooms.indexOf(room);
            if (index >= 0) {
                this.rooms.splice(index, 1);
                return true;
            }
            return false;
        }

        private receiveMessage(room: Models.Room, message: Models.Message): void {
            if (this.onmessagereceived) {
                this.onmessagereceived(room.id, message);
            }

            // no notification if it's our own message
            if (message.fromUser.id === this.currentUser.id) {
                message.unread = false;
                return;
            }

            this.notifyNewUnreadMessage(room, message);

            this.notifyNewUnreadMentions(room, message);
        }

        private notifyNewUnreadMessage(room: Models.Room, message: Models.Message): void {
            // push unread message if notifications are globally enabled for this room
            if (!room.lurk) {
                // increment unread count
                room.unreadItems++;

                // send notification if settings enabled
                if (this.FeatureToggleService.isNewMessageNotificationEnabled()) {
                    this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, `New message - ${room.name}`, message.text, { launch: `action=viewRoom&roomId=${room.id}` });
                }
            }
        }

        private notifyNewUnreadMentions(room: Models.Room, message: Models.Message): void {
            // for each mention contained in the message
            for (let i = 0; i < message.mentions.length; i++) {
                // push mention (count + notification)
                if (message.mentions[i].userId == this.currentUser.id) {
                    // increment mentions count
                    room.mentions++;

                    // send notification if settings enabled
                    if (this.FeatureToggleService.isNewMessageNotificationEnabled()) {
                        let replyOptions: IReplyOptions = {
                            id: 'message',
                            type: 'text',
                            content: 'Send',
                            placeHolderContent: 'Type a reply',
                            arguments: `action=reply&roomId=${room.id}`,
                            defaultInput: `@${message.fromUser.username} `,
                            image: 'assets/icons/send.png',
                            activationType: 'background'
                        };
                        this.ToastNotificationService.sendImageTitleAndTextNotificationWithReply(room.image, `${message.fromUser.username} mentioned you`, message.text, replyOptions, { launch: `action=viewRoom&roomId=${room.id}` });
                    }
                }
            }
        }

        // public methods
        public logIn(callback?: { (): void }): void {
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

            this.OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                this.RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    this.ApiService.getCurrentUser().then(user => {
                        console.log('Sucessfully logged in');

                        this.currentUser = user;
                        this.refreshRooms(() => {
                            // app is now initialized and user logged in
                            this.loggedIn = true;
                            if (callback) {
                                callback();
                            }
                        });
                    });
                });
            });
        }

        public reset(): void {
            // unsubscribe to each room
            for (var i = 0; i < this.rooms.length; i++) {
                this.RealtimeApiService.unsubscribe(this.rooms[i].id);
            }

            // reset properties
            this.currentUser = undefined;
            this.rooms = [];
            this.currentRoom = undefined;
            this.loggedIn = false;
        }

        public refreshRooms(callback?: () => void): void {
            // unsubscribe to each room
            for (var i = 0; i < this.rooms.length; i++) {
                this.RealtimeApiService.unsubscribe(this.rooms[i].id);
            }

            this.currentRoom = undefined;
            this.rooms = [];

            this.ApiService.getRooms().then(rooms => {
                // import all rooms from API
                for (let i = 0; i < rooms.length; i++) {
                    this.addRoom(rooms[i]);
                }

                if (callback) {
                    callback();
                }
            });
        }

        public getRoomById(id: string): Models.Room {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].id === id) {
                    return this.rooms[i];
                }
            }
        }

        public getRoom(name: string): Models.Room {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].name === name) {
                    return this.rooms[i];
                }
            }
        }

        public selectRoom(room: Models.Room): void {
            this.currentRoom = room;
            if (this.onroomselected) {
                this.onroomselected();
            }
        }

        public canJoin(name: string): boolean {
            return !this.getRoom(name);
        }

        public createRoom(name: string, callback: { (room: Models.Room): void }): void {
            this.ApiService.joinRoom(name).then(room => {
                this.addRoom(room);
                callback(room);
            });
        }

        public createChannel(channel: Models.NewChannel, callback: { (room: Models.Room): void }): void {
            this.ApiService.createChannel(channel).then(room => {
                this.addRoom(room);
                callback(room);
            });
        }

        public markUnreadMessages(messageIds: string[]): void {
            this.ApiService.markUnreadMessages(this.currentUser.id, this.currentRoom.id, messageIds).then(response => {
                if (response) {
                    this.currentRoom.unreadItems -= messageIds.length;
                }
            });
        }

        public leaveRoom(room: Models.Room, callback: { (): void }): void {
            this.ApiService.leaveRoom(room.id, this.currentUser.id).then(() => {
                callback();
                this.removeRoom(room);
            });
        }

        public deleteRoom(room: Models.Room, callback: { (): void }): void {
            this.ApiService.deleteRoom(room.id).then(() => {
                callback();
                this.removeRoom(room);
            });
        }
    }
}