angular.module('modern-gitter')
    .service('RoomsService', function (OAuthService, NetworkService, ApiService, RealtimeApiService) {
        var roomsService = this;

        // properties
        roomsService.initialized = false;
        roomsService.rooms = [];

        // methods
        roomsService.initialize = function () {
            OAuthService.connect().then(t => {
                console.log('Sucessfully logged to Gitter API');

                RealtimeApiService.initialize().then(t => {
                    console.log('Sucessfully subscribed to realtime API');

                    ApiService.getRooms().then(rooms => {
                        roomsService.setRooms(rooms);
                        roomsService.initialized = true;
                    });
                });
            });
        }

        roomsService.setRooms = function (rooms) {
            roomsService.rooms = rooms;

            for (var i = 0; i < roomsService.rooms.length; i++) {
                // compute room image
                if (roomsService.rooms[i].user) {
                    roomsService.rooms[i].image = roomsService.rooms[i].user.avatarUrlMedium;
                } else {
                    roomsService.rooms[i].image = "https://avatars.githubusercontent.com/" + roomsService.rooms[i].name.split('/')[0];
                }

                // subscribe to realtime messages
                RealtimeApiService.subscribe(roomsService.rooms[i].id, function (roomId, message) {
                    if (roomsService.onmessagereceived) {
                        roomsService.onmessagereceived(roomId, message);
                    }
                    // TODO : send notification
                });
            }
        };

        roomsService.selectRoom = function (room) {
            roomsService.currentRoom = room;
            if (roomsService.onroomselected) {
                roomsService.onroomselected();
            }
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