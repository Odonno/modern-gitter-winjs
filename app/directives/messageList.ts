/// <reference path="../../typings/tsd.d.ts" />

module Application.Directives {
    export class MessageList implements ng.IDirective {
        restrict = 'E';
        replace = true;
        templateUrl = 'partials/directives/message-list.html';
        link = (scope: Controllers.IChatScope, element: JQuery, attrs: ng.IAttributes) => {
            // initialize variables
            let angularElement = angular.element(element);
            scope.autoScrollDown = true;
            scope.canLoadMoreMessages = false;
            scope.fetchingPreviousMessages = false;

            // initialize directive element
            let initialize = () => {
                // check if a new message is sent
                this.RoomsService.onmessagereceived = (roomId, message) => {
                    if (scope.room && scope.room.id === roomId) {
                        scope.messages.push(message);

                        if (scope.autoScrollDown) {
                            let refreshCount = 5;
                            let timer = setInterval(() => {
                                scrollToBottom();
                                if (--refreshCount <= 0) {
                                    clearInterval(timer);
                                }
                            }, 200);
                        }
                    }
                };

                // load messages list
                this.ApiService.getMessages(scope.room.id).then(messages => {
                    scope.messages = [];
                    for (let i = 0; i < messages.length; i++) {
                        scope.messages.push(messages[i]);
                    }
                });

                // scroll to bottom once messages are loaded in the UI
                this.$timeout(() => {
                    scrollToBottom();
                    scope.canLoadMoreMessages = true;
                }, 1000);

                // add event when user scroll on the list
                angularElement.bind("scroll", this._.throttle(watchScroll, 200));
            };

            // fetch previous messages
            let fetchPreviousMessages = () => {
                if (!scope.canLoadMoreMessages)
                    return;

                // load more messages
                let olderMessage = scope.messages[0];

                // room does not contain any message
                if (!olderMessage) {
                    scope.canLoadMoreMessages = false;
                    return;
                }

                // cannot fetch message if we're already doing it
                if (scope.fetchingPreviousMessages)
                    return;

                // start fetching messages
                scope.fetchingPreviousMessages = true;

                this.ApiService.getMessages(scope.room.id, olderMessage.id).then(beforeMessages => {
                    // no more message to load
                    if (!beforeMessages || beforeMessages.length <= 0) {
                        scope.canLoadMoreMessages = false;
                        return;
                    }

                    // push old messages to the top
                    for (let i = beforeMessages.length - 1; i >= 0; i--) {
                        scope.messages.unshift(beforeMessages[i]);
                    }

                    // scroll to the previous message
                    this.$location.hash('message-' + olderMessage.id);

                    // stop fetching messages
                    scope.fetchingPreviousMessages = false;
                });
            };

            let detectUnreadMessages = () => {
                let topOfScrollview = angularElement[0].scrollTop;
                let bottomOfScrollview = angularElement[0].scrollTop + angularElement[0].offsetHeight;
                let topOfMessageElement = 0;

                // retrieve id of unread messages that user watch
                let messageIds = [];

                for (let i = 0; i < scope.messages.length; i++) {
                    let message = scope.messages[i];
                    let messageElement = document.getElementById('message-' + message.id);

                    if (!messageElement)
                        continue;

                    if (message.unread) {
                        let bottomOfMessageElement = topOfMessageElement + messageElement.offsetHeight;

                        if (bottomOfMessageElement >= topOfScrollview && topOfMessageElement <= bottomOfScrollview) {
                            messageIds.push(message.id);
                            message.unread = false;
                        }
                    }

                    topOfMessageElement += messageElement.offsetHeight;
                }

                // if there is at least 1 unread message, mark them as read
                if (messageIds.length > 0) {
                    this.RoomsService.markUnreadMessages(messageIds);
                }
            };

            // scroll to bottom of the list
            let scrollToBottom = () => {
                angularElement[0].scrollTop = angularElement[0].scrollHeight;
            };

            // detect if we are at the bottom of the chat list
            let hasScrollReachedBottom = (): boolean => {
                return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= angularElement[0].scrollHeight;
            };
            // detect if we are near bottom of the chat list
            let hasScrollReachedNearBottom = (): boolean => {
                return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= (angularElement[0].scrollHeight - 50);
            };
            // detect if we are at the top of the chat list
            let hasScrollReachedTop = (): boolean => {
                return angularElement[0].scrollTop === 0;
            };
            // detect if we are near top of the chat list
            let hasScrollReachedNearTop = (): boolean => {
                return angularElement[0].scrollTop <= 150;
            };

            // listen to each scroll
            let watchScroll = () => {
                // set auto scroll down enable if we reached near bottom
                scope.autoScrollDown = hasScrollReachedNearBottom();

                // laod more messages if we reached near top
                if (hasScrollReachedNearTop()) {
                    fetchPreviousMessages();
                }

                // detect unread messages
                detectUnreadMessages();
            };

            initialize();
        };

        constructor(private _: _.LoDashStatic, private $timeout: ng.ITimeoutService, private $location: ng.ILocationService, private ApiService: Services.ApiService, private RoomsService: Services.RoomsService) {
        }
    }
}