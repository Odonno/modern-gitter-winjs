/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class RoomCtrl {
        private scope: any;
        private currentUser: any;

        constructor($scope, private ApiService: Application.Services.ApiService, private RoomsService: Application.Services.RoomsService, private FeatureToggleService: Application.Services.FeatureToggleService) {
            this.scope = $scope;
            
            // properties
            this.scope.useWinjsListView = this.FeatureToggleService.useWinjsListView();
            this.scope.listOptions = {};
            this.scope.hideProgress = true;
            this.scope.refreshed = false;
            this.scope.room = this.RoomsService.currentRoom;
            this.scope.messages = [];
            this.scope.textMessage = '';
            this.scope.sendingMessage = false;

            // methods
            this.scope.sendMessage = () => {
                // do not send the same message multiple times
                if (this.scope.sendingMessage) {
                    return false;
                }

                if (this.scope.textMessage) {
                    this.scope.sendingMessage = true;
                    this.ApiService.sendMessage(this.scope.room.id, this.scope.textMessage).then(message => {
                        this.scope.textMessage = '';
                        this.scope.sendingMessage = false;
                    });
                } else {
                    console.error('textMessage is empty');
                }
            };

            // initialize controller
            if (!this.scope.room) {
                console.error('no room selected...');
                return;
            }

            this.RoomsService.onmessagereceived = (roomId, message) => {
                if (this.scope.room && this.scope.room.id === roomId) {
                    this.scope.messages.push(message);
                }
            };

            this.ApiService.getCurrentUser().then(user => {
                this.currentUser = user;

                this.ApiService.getMessages(this.scope.room.id).then(messages => {
                    this.scope.messages = messages;

                    if (this.FeatureToggleService.useWinjsListView()) {
                        // refresh UI
                        this.scope.messagesWinControl.forceLayout();
                        
                        // wait for refresh
                        this.scope.messagesWinControl.onloadingstatechanged = (e) => {
                            if (this.scope.messagesWinControl.loadingState === "complete") {
                                // detect visible unread messages
                                if (this.scope.refreshed) {
                                    this.detectUnreadMessages();
                                }
                        
                                // refresh listview the first time
                                if (!this.scope.refreshed) {
                                    this.refreshListView();
                                }
                            }
                        };
                    } else {
                        var listview = document.getElementById('customMessagesListView');

                        var scrollToBottomInterval = setInterval(() => {
                            var lastScrollTop = listview.scrollTop;
                            listview.scrollTop += 500;
                            
                            if (listview.scrollTop > 0 && listview.scrollTop === lastScrollTop) {
                                clearInterval(scrollToBottomInterval);
                            }
                        }, 50);
                    }
                });
            });

        }
        
        // private methods
        private refreshListView() {
            // scroll down to the last message
            this.scope.messagesWinControl.ensureVisible(this.scope.messages.length - 1);
            this.scope.hideProgress = false;
            this.scope.refreshed = true;

            this.scope.messagesWinControl.onheadervisibilitychanged = (e) => {
                // when we hit the top of the list
                if (e.detail.visible && this.scope.messages.length > 0) {
                    // retrieve index of message that was visible before the load of new messages
                    var lastVisible = this.scope.messagesWinControl.indexOfLastVisible;

                    // load more messages
                    this.ApiService.getMessages(this.scope.room.id, this.scope.messages[0].id).then(beforeMessages => {
                        if (!beforeMessages || beforeMessages.length <= 0) {
                            // no more message to load
                            this.scope.hideProgress = true;
                            return;
                        }

                        for (var i = beforeMessages.length - 1; i >= 0; i--) {
                            this.scope.messages.unshift(beforeMessages[i]);
                        }

                        // scroll again to stay where the user was (reading message)
                        setTimeout(() => {
                            this.scope.messagesWinControl.ensureVisible(lastVisible + beforeMessages.length);
                        }, 250);
                    });
                }
            }
        }

        private detectUnreadMessages() {
            var firstIndex = this.scope.messagesWinControl.indexOfFirstVisible;
            var lastIndex = this.scope.messagesWinControl.indexOfLastVisible;

            var messageIds = [];
            for (var i = 0; i < this.scope.messages.length; i++) {
                if (i >= firstIndex && i <= lastIndex && this.scope.messages[i].unread) {
                    messageIds.push(this.scope.messages[i].id);
                    this.scope.messages[i].unread = false;
                }
            }

            if (messageIds.length > 0) {
                this.RoomsService.markUnreadMessages(messageIds);
            }
        }
    }
}