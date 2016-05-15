/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddRoomScope extends ng.IScope {
        currentView: string;
    }
    
    export class AddRoomCtrl {
        constructor($scope: IAddRoomScope, $state: ng.ui.IStateService) {
            // properties
            $scope.currentView = 'existing';
            
            // watch event
            $scope.$watch(() => {
                return $state.current.name;
            }, () => {
                var stateName = $state.current.name;
                $scope.currentView = stateName.substring(stateName.indexOf('.') + 1);
            });
        }
    }
}