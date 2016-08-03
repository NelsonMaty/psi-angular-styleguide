(function() {
    'use strict';

    angular
        .module('app.components')
        .directive('uncEditCard', editCard);

    /* @ngInject */
    function editCard() {
        var directive = {
            restrict: 'E',
            templateUrl: 'edit-card.directive.html',
            scope: {
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = [];

    /* @ngInject */
    function Controller() {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
