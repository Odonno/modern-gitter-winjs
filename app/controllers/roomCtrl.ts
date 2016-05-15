/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IRoomScope extends ng.IScope {
        listOptions: any;
        hideProgress: boolean;
        refreshed: boolean;
        room: Models.Room;
        messages: Models.Message[];
        textMessage: string;
        sendingMessage: boolean;

        sendMessage(): void;
        detectUnreadMessages(): void;
        loadMoreItems(): void;
    }

    export class RoomCtrl {
        constructor($scope: IRoomScope, private ApiService: Services.ApiService, private RoomsService: Services.RoomsService, private LocalSettingsService: Services.LocalSettingsService, private FeatureToggleService: Services.FeatureToggleService) {
            // properties
            $scope.listOptions = {};
            $scope.hideProgress = false;
            $scope.refreshed = false;
            $scope.room = this.RoomsService.currentRoom;
            $scope.messages = [];
            $scope.textMessage = '';
            $scope.sendingMessage = false;

            // methods
            $scope.sendMessage = () => {
                // do not send the same message multiple times
                if ($scope.sendingMessage) {
                    return false;
                }

                if ($scope.textMessage) {
                    $scope.sendingMessage = true;
                    this.ApiService.sendMessage($scope.room.id, $scope.textMessage).then(message => {
                        $scope.textMessage = '';
                        $scope.$apply();
                        $scope.sendingMessage = false;
                    });
                } else {
                    console.error('textMessage is empty');
                }
            };

            $scope.detectUnreadMessages = () => {
                var firstIndex: number, lastIndex: number;

                var range = $scope.listOptions.range;
                firstIndex = range.index;
                lastIndex = range.index + range.length;

                // retrieve id of unread messages that user watch
                var messageIds = [];
                for (var i = 0; i < $scope.messages.length; i++) {
                    if (i >= firstIndex && i <= lastIndex && $scope.messages[i].unread) {
                        messageIds.push($scope.messages[i].id);
                        $scope.messages[i].unread = false;
                    }
                }

                // if there is at least 1 unread message, mark them as read
                if (messageIds.length > 0) {
                    this.RoomsService.markUnreadMessages(messageIds);
                }
            }

            $scope.loadMoreItems = () => {
                var listview = document.getElementById('customMessagesListView');
                var lastScrollHeight = $scope.listOptions.listView.getScrollHeight();

                if ($scope.hideProgress) {
                    return;
                }

                $scope.hideProgress = true;

                // load more messages
                var olderMessage = $scope.messages[$scope.messages.length - 1];
                this.ApiService.getMessages($scope.room.id, olderMessage.id).then(beforeMessages => {
                    if (!beforeMessages || beforeMessages.length <= 0) {
                        // no more message to load
                        return;
                    }

                    // push old messages to the top
                    for (var i = beforeMessages.length - 1; i >= 0; i--) {
                        $scope.messages.push(beforeMessages[i]);
                    }

                    setTimeout(() => {
                        var newScrollHeight = $scope.listOptions.listView.getScrollHeight();
                        listview.scrollTop += newScrollHeight - lastScrollHeight;
                        $scope.hideProgress = false;
                    }, 250);
                });
            }

            // initialize controller
            if (!$scope.room) {
                console.error('no room selected...');
                return;
            }

            // update local storage
            this.LocalSettingsService.setValue('lastPage', 'room');
            this.LocalSettingsService.setValue('lastRoom', $scope.room.name);

            // check if a new message is sent
            this.RoomsService.onmessagereceived = (roomId, message) => {
                if ($scope.room && $scope.room.id === roomId) {
                    $scope.messages.unshift(message);
                }
            };

            // load messages list
            this.ApiService.getCurrentUser().then(user => {
                this.ApiService.getMessages($scope.room.id).then(messages => {
                    $scope.messages = [];
                    for (var i = 0; i < messages.length; i++) {
                        $scope.messages.unshift(messages[i]);
                    }

                    var listview = document.getElementById('customMessagesListView');

                    // each time user scroll
                    listview.onscroll = () => {
                        // detect scroll to detect unread message on view
                        $scope.detectUnreadMessages();

                        // detect if we are at the top of the list (load more messages)
                        var range = $scope.listOptions.range;
                        if (range && range.index + range.length === range.total) {
                            $scope.loadMoreItems();
                        }
                    };
                });
            });
        }
    }
}