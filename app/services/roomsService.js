angular.module('modern-gitter')
    .service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService, ToastNotificationService) {
        var roomsService = this;

        // properties
        roomsService.initialized = false;
        roomsService.rooms = [];

        // private methods
        function addRoom(room) {
            // compute room image
            if (room.user) {
                room.image = room.user.avatarUrlMedium;
            } else {
                room.image = "https://avatars.githubusercontent.com/" + room.name.split('/')[0];
            }
                
            // subscribe to realtime messages
            RealtimeApiService.subscribe(room.id, function (roomId, message) {
                if (roomsService.onmessagereceived) {
                    roomsService.onmessagereceived(roomId, message);
                }
                
                // send notification
                ToastNotificationService.sendImageTitleAndTextNotification(room.image, 'New message - ' + room.name, message.text);
            });

            roomsService.rooms.push(room);
        }

        // public methods
        roomsService.initialize = function () {
            OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    ApiService.getRooms().then(rooms => {
                        for (var i = 0; i < rooms.length; i++) {
                            addRoom(rooms[i]);
                        }
                        roomsService.initialized = true;
                    });
                });
            });
        }

        roomsService.selectRoom = function (room) {
            roomsService.currentRoom = room;
            if (roomsService.onroomselected) {
                roomsService.onroomselected();
            }
        };

        roomsService.createRoom = function (name, callback) {
            ApiService.joinRoom(name).then(room => {
                addRoom(room);
                callback(room);
            });
        };
        
        roomsService.createChannel = function (channel, callback) {
            ApiService.createChannel(channel).then(room => {
                addRoom(room);
                callback(room);
            });
        };

        // initialize service 
        if (NetworkService.internetAvailable) {
            roomsService.initialize();
        }

        // check when internet status changed
        NetworkService.statusChanged(function () {
            if (!roomsService.initialized && NetworkService.internetAvailable) {
                roomsService.initialize();
            }
        });

        return roomsService;
    });