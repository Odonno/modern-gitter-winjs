/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class RoomCtrl {
        private scope: any;

        constructor($scope, private ApiService, RoomsService) {
            this.scope = $scope;
            
            // properties
            this.scope.hideProgress = true;
            this.scope.refreshed = false;
            this.scope.room = RoomsService.currentRoom;
            this.scope.messages = [];

            // methods
            this.scope.sendMessage = () => {
                if (this.scope.textMessage) {
                    ApiService.sendMessage(this.scope.room.id, this.scope.textMessage).then(message => {
                        this.scope.textMessage = '';
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

            RoomsService.onmessagereceived = (roomId, message) => {
                if (this.scope.room && this.scope.room.id === roomId) {
                    this.scope.messages.push(message);
                }
            };

            ApiService.getMessages(this.scope.room.id).then(messages => {
                this.scope.messages = messages;

                // refresh UI
                this.scope.messagesWinControl.forceLayout();

                // wait for refresh
                this.scope.messagesWinControl.onloadingstatechanged = (e) => {
                    if (this.scope.messagesWinControl.loadingState === "complete") {
                        // refresh listview the first time
                        if (!this.scope.refreshed) {
                            this.refreshListView();
                        }
                        
                        // detect visible unread messages
                    };
                };
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
    }
}