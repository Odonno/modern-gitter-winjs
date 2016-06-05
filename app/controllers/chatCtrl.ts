/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IChatScope extends ng.IScope {
        room: Models.Room;
        messages: Models.Message[];
        textMessage: string;
        sendingMessage: boolean;
        autoScrollDown: boolean;
        canLoadMoreMessages: boolean;
        fetchingPreviousMessages: boolean;

        getMessageById(id: string): Models.Message;
        reply(messageId: string): void;
        quote(messageId: string): void;
        returnLine(): void;
        sendMessage(): void;
    }

    export class ChatCtrl {
        constructor($scope: IChatScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, NavigationService: Services.NavigationService, LocalSettingsService: Services.LocalSettingsService, ToastNotificationService: Services.ToastNotificationService, FeatureToggleService: Services.FeatureToggleService) {
            // navigate to error page when there is no selected room
            if (!RoomsService.currentRoom) {
                console.error('no room selected...');
                $state.go('error', { errorType: 'noRoomSelected' });
                return;
            }

            // properties
            $scope.room = RoomsService.currentRoom;
            $scope.messages = [];
            $scope.textMessage = '';
            $scope.sendingMessage = false;

            // methods
            $scope.getMessageById = (id: string) => {
                for (let i = 0; i < $scope.messages.length; i++) {
                    if ($scope.messages[i].id == id) {
                        return $scope.messages[i];
                    }
                }
            };

            $scope.reply = (messageId: string) => {
                let message = $scope.getMessageById(messageId);
                if (message) {
                    $scope.textMessage += `@${message.fromUser.username} `;
                }
            };

            $scope.quote = (messageId: string) => {
                let message = $scope.getMessageById(messageId);
                if (message) {
                    $scope.textMessage += `> ${message.text}`;
                }
            };

            $scope.returnLine = () => {
                if (FeatureToggleService.isLineReturnShouldSendChatMessage()) {
                    $scope.sendMessage();
                }
            };

            $scope.sendMessage = () => {
                // do not send the same message multiple times
                if ($scope.sendingMessage) {
                    return;
                }

                if ($scope.textMessage) {
                    $scope.sendingMessage = true;
                    ApiService.sendMessage($scope.room.id, $scope.textMessage).then(message => {
                        $scope.textMessage = '';
                        $scope.sendingMessage = false;
                        $scope.$apply();
                    });
                } else {
                    console.error('textMessage is empty');
                }
            };

            // update local storage
            LocalSettingsService.set('lastPage', 'chat');
            LocalSettingsService.set('lastRoom', $scope.room.name);

            // initialize controller
            if (FeatureToggleService.isDebugMode() && false) {
                // send test notification (new message)
                let toastOptions: Services.IToastOptions = {
                    launch: `action=viewRoom&roomId=${$scope.room.id}`
                };
                ToastNotificationService.sendImageTitleAndTextNotification($scope.room.image, 'Title of notification', 'A message with a < or a >', toastOptions);

                // send test notification (mention with reply feature)
                let username = 'gitter-bot';
                let replyOptions: Services.IReplyOptions = {
                    id: 'message',
                    type: 'text',
                    content: 'Send',
                    placeHolderContent: 'Type a reply',
                    arguments: `action=reply&roomId=${$scope.room.id}`,
                    defaultInput: `@${username} `,
                    image: 'assets/icons/send.png',
                    activationType: 'background'
                };
                ToastNotificationService.sendImageTitleAndTextNotificationWithReply($scope.room.image, `${username} mentioned you`, 'This is a test message, please respond', replyOptions, toastOptions);
            }
        }
    }
}