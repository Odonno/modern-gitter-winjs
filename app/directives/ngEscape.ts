/// <reference path="../../typings/tsd.d.ts" />

module Application.Directives {
    export class NgEscape implements ng.IDirective {
        link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
            element.bind("keydown keypress", (event) => {
                if (event.which === 27) {
                    scope.$apply(() => {
                        scope.$eval(attrs['ngEscape']);
                    });
                    event.preventDefault();
                }
            });
        }
    }
}