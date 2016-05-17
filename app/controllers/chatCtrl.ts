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
        
        sendMessage(): void;
    }

    export class ChatCtrl {
        constructor($scope: IChatScope, $state: ng.ui.IStateService, ApiService: Services.ApiService, RoomsService: Services.RoomsService, NavigationService: Services.NavigationService, LocalSettingsService: Services.LocalSettingsService) {
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
            $scope.sendMessage = () => {
                // do not send the same message multiple times
                if ($scope.sendingMessage) {
                    return;
                }

                if ($scope.textMessage) {
                    $scope.sendingMessage = true;
                    ApiService.sendMessage($scope.room.id, $scope.textMessage).then(message => {
                        $scope.textMessage = '';
                        $scope.$apply();
                        $scope.sendingMessage = false;
                    });
                } else {
                    console.error('textMessage is empty');
                }
            };

            // update local storage
            LocalSettingsService.setValue('lastPage', 'chat');
            LocalSettingsService.setValue('lastRoom', $scope.room.name);
        }
    }
}