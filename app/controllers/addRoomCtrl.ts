/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export interface IAddRoomScope extends ng.IScope {
        currentView: string;
    }
    
    export class AddRoomCtrl {
        constructor($scope: IAddRoomScope, $state: ng.ui.IStateService) {
            // properties
            $scope.currentView = 'suggested';
            
            // watch event
            $scope.$watch(() => {
                return $state.current.name;
            }, () => {
                let stateName = $state.current.name;
                $scope.currentView = stateName.substring(stateName.indexOf('.') + 1);
            });
        }
    }
}