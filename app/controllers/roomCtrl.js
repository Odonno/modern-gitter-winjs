angular.module('modern-gitter')
    .controller('RoomCtrl', function ($scope, ApiService, RoomsService) {
        // properties
        $scope.hideProgress = true;
        $scope.room = RoomsService.currentRoom;
        $scope.messages = [];

        // methods
        $scope.sendMessage = function () {
            if ($scope.textMessage) {
                ApiService.sendMessage($scope.room.id, $scope.textMessage).then(message => {
                    $scope.textMessage = '';
                });
            } else {
                console.error('textMessage is empty');
            }
        };

        // initialize controller
        if (!$scope.room) {
            console.error('no room selected...');
            return;
        }

        RoomsService.onmessagereceived = function (roomId, message) {
            if ($scope.room && $scope.room.id === roomId) {
                $scope.messages.push(message);
            }
        };

        ApiService.getMessages($scope.room.id).then(messages => {
            $scope.messages = messages;

            // refresh UI
            $scope.messagesWinControl.forceLayout();

            // wait for refresh
            setTimeout(function () {
                // scroll down to the last message
                $scope.messagesWinControl.ensureVisible($scope.messages.length - 1);
                $scope.hideProgress = false;

                $scope.messagesWinControl.onheadervisibilitychanged = function (ev) {
                    var visible = ev.detail.visible;
                    if (visible && $scope.messages.length > 0) {
                        // retrieve index of message that was visible before the load of new messages
                        var lastVisible = $scope.messagesWinControl.indexOfLastVisible;

                        // load more messages
                        ApiService.getMessages($scope.room.id, $scope.messages[0].id).then(beforeMessages => {
                            if (beforeMessages.length === 0) {
                                // no more message to load
                                $scope.hideProgress = true;
                                return;
                            }

                            for (var i = beforeMessages.length - 1; i >= 0; i--) {
                                $scope.messages.unshift(beforeMessages[i]);
                            }

                            // scroll again to stay where the user was (reading message)
                            setTimeout(function () {
                                $scope.messagesWinControl.ensureVisible(lastVisible + beforeMessages.length);
                            }, 250);
                        });
                    }
                };
            }, 500);
        });
    });