/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class HomeCtrl {
        private scope: any;

        constructor($scope, $state, RoomsService, FeatureToggleService: Application.Services.FeatureToggleService, ToastNotificationService: Application.Services.ToastNotificationService) {
            this.scope = $scope;
            
            // properties
            if (FeatureToggleService.isWindowsApp()) {
                var currentPackage = Windows.ApplicationModel.Package.current;
                var packageVersion = currentPackage.id.version;

                this.scope.appVersion = packageVersion.major + '.' + packageVersion.minor + '.' + packageVersion.build;
            } else {
                this.scope.appVersion = 'web';
            }

            this.scope.showMyImage = FeatureToggleService.isMyImageShown();
            
            // methods
            this.scope.chatWithUs = () => {
                var roomName = 'Odonno/Modern-Gitter';

                // go to existing room if we already joined it
                for (var i = 0; i < RoomsService.rooms.length; i++) {
                    if (RoomsService.rooms[i].name === roomName) {
                        RoomsService.selectRoom(RoomsService.rooms[i]);
                        $state.go('room');
                        return;
                    }
                }
                
                // join the room
                RoomsService.createRoom(roomName, (room) => {
                    ToastNotificationService.sendImageAndTextNotification(room.image, 'You joined the room ' + room.name, 'action=viewRoom&amp;roomId=' + room.id);
                    RoomsService.selectRoom(room);
                    $state.go('room');
                });
            };
        }
    }
}