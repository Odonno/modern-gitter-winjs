/// <reference path="../../typings/tsd.d.ts" />

module Application.Directives {
    export class NgEnter implements ng.IDirective {
        link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
            element.bind("keydown keypress", (event) => {
                if (event.which === 13) {
                    scope.$apply(() => {
                        scope.$eval(attrs['ngEnter']);
                    });
                    if (attrs['noLineReturn'] == 'true') {
                        event.preventDefault();
                    }
                }
            });
        }
    }
}