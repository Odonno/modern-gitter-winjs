/// <reference path="../../typings/tsd.d.ts" />

module Application.Directives {
    export class MessageList implements ng.IDirective {
        restrict = 'E';
        replace = true;
        templateUrl = 'partials/message-list.html';
        link = (scope: Controllers.IChatScope, element: JQuery, attrs: ng.IAttributes) => {
            var angularElement = angular.element(element);
            scope.autoScrollDown = true;

            // initialize directive element
            var initialize = () => {
                // check if a new message is sent
                this.RoomsService.onmessagereceived = (roomId, message) => {
                    if (scope.room && scope.room.id === roomId) {
                        scope.messages.push(message);
                    }
                };

                // load messages list
                this.ApiService.getMessages(scope.room.id).then(messages => {
                    scope.messages = [];
                    for (var i = 0; i < messages.length; i++) {
                        scope.messages.push(messages[i]);
                    }
                });

                // scroll to bottom once messages are loaded in the UI
                this.$timeout(() => {
                    scrollToBottom();
                    scope.canLoadMoreMessages = true;
                }, 1000);

                // add event when user scroll on the list
                angularElement.bind("scroll", this._.debounce(watchScroll, 100));
            };

            // fetch previous messages
            var fetchPreviousMessages = () => {
                if (!scope.canLoadMoreMessages)
                    return;

                // load more messages
                var olderMessage = scope.messages[0];
                this.ApiService.getMessages(scope.room.id, olderMessage.id).then(beforeMessages => {
                    // no more message to load
                    if (!beforeMessages || beforeMessages.length <= 0) {
                        scope.canLoadMoreMessages = false;
                        return;
                    }

                    // push old messages to the top
                    for (var i = beforeMessages.length - 1; i >= 0; i--) {
                        scope.messages.unshift(beforeMessages[i]);
                    }

                    // scroll to the previous message
                    this.$location.hash('message-' + olderMessage.id);
                });
            };

            // scroll to bottom of the list
            var scrollToBottom = () => {
                angularElement[0].scrollTop = angularElement[0].scrollHeight;
            };

            // detect if we are at the bottom of the chat list
            var hasScrollReachedBottom = (): boolean => {
                return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= angularElement[0].scrollHeight;
            };
            // detect if we are near bottom of the chat list
            var hasScrollReachedNearBottom = (): boolean => {
                return (angularElement[0].scrollTop + angularElement[0].clientHeight) >= (angularElement[0].scrollHeight - 50);
            };
            // detect if we are at the top of the chat list
            var hasScrollReachedTop = (): boolean => {
                return angularElement[0].scrollTop === 0;
            };
            // detect if we are near top of the chat list
            var hasScrollReachedNearTop = (): boolean => {
                return angularElement[0].scrollTop <= 150;
            };

            // listen to each scroll
            var watchScroll = () => {
                // set auto scroll down enable if we reached near bottom
                scope.autoScrollDown = hasScrollReachedNearBottom();

                // laod more messages if we reached near top
                if (hasScrollReachedNearTop()) {
                    fetchPreviousMessages();
                }
            };

            initialize();
        };

        constructor(private _, private $timeout: ng.ITimeoutService, private $location: ng.ILocationService, private ApiService: Services.ApiService, private RoomsService: Services.RoomsService) {
        }
    }
}