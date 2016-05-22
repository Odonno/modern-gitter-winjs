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
            if (FeatureToggleService.isDebugMode()) {
                // send test notification (new message)
                ToastNotificationService.sendImageTitleAndTextNotification($scope.room.image, 'Title of notification', 'A message with a < or a >', 'action=viewRoom&roomId=' + $scope.room.id);
                
                // send test notification (mention with reply feature)
                var username = 'gitter-bot';
                var replyOptions = {
                    args: 'action=reply&roomId=' + $scope.room.id,
                    text: '@' + username + ' ',
                    image: 'assets/icons/send.png'
                };
                ToastNotificationService.sendImageTitleAndTextNotificationWithReply($scope.room.image, username + ' mentioned you', 'This is a test message, please respond', replyOptions, 'action=viewRoom&roomId=' + $scope.room.id);
            }
        }
    }
}