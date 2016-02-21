/// <reference path="../../typings/tsd.d.ts" />

module Application.Controllers {
    export class AddRoomCtrl {
        private scope: any;

        constructor($scope, $state) {
            this.scope = $scope;
            
            // properties
            this.scope.currentView = 'existing';
            
            // watch event
            this.scope.$watch(() => {
                return $state.current.name;
            }, () => {
                var stateName = $state.current.name;
                this.scope.currentView = stateName.substring(stateName.indexOf('.') + 1);
            });
        }
    }
}