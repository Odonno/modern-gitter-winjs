/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class RoomsService {
        // properties
        public initialized = false;
        public currentRoom: any;
        public rooms = [];
        public onroomselected: any;

        constructor(private OAuthService: Application.Services.OAuthService, private NetworkService: Application.Services.NetworkService, private ApiService: Application.Services.ApiService, private RealtimeApiService: Application.Services.RealtimeApiService, private ToastNotificationService: Application.Services.ToastNotificationService) {
            // initialize service 
            if (this.NetworkService.internetAvailable) {
                this.initialize();
            }

            // check when internet status changed
            this.NetworkService.statusChanged(function() {
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
            this.RealtimeApiService.subscribe(room.id, function(roomId, message) {
                if (this.onmessagereceived) {
                    this.onmessagereceived(roomId, message);
                }
                
                // send notification
                this.ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text);
            });

            this.rooms.push(room);
        }

        // public methods
        public initialize() {
            this.OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                this.RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    this.ApiService.getRooms().then(rooms => {
                        for (var i = 0; i < rooms.length; i++) {
                            this.addRoom(rooms[i]);
                        }
                        this.initialized = true;
                    });
                });
            });
        }

        public selectRoom(room) {
            this.currentRoom = room;
            if (this.onroomselected) {
                this.onroomselected();
            }
        };

        public createRoom(name, callback) {
            this.ApiService.joinRoom(name).then(room => {
                this.addRoom(room);
                callback(room);
            });
        };

        public createChannel(channel, callback) {
            this.ApiService.createChannel(channel).then(room => {
                this.addRoom(room);
                callback(room);
            });
        };
    }
}