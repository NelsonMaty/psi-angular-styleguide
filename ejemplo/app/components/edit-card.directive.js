(function() {
    'use strict';

    angular
        .module('app.components')
        .directive('uncEditCard', editCard);

    /* @ngInject */
    function editCard() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/edit-card.directive.html',
            scope: {
              todo: "=",
              onSave: "&"
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
          console.log(scope.vm.todo);
        }
    }

    Controller.$inject = [];

    /* @ngInject */
    function Controller() {
        var vm = this;
        vm.colors = null;

        activate();

        function activate() {
          vm.colors = [
            {
              'nombre':'Rojo',
              'valor': '#FF8A80'
            },
            {
              'nombre':'Naranja',
              'valor': '#FFD180'
            },
            {
              'nombre':'Verde',
              'valor': '#CCFF90'
            },
            {
              'nombre':'Amarillo',
              'valor': '#FFFF8D'
            },
            {
              'nombre':'Gris',
              'valor': '#CFD8DC'
            },{
              'nombre':'Azul',
              'valor': '#80D8FF'
            },
            {
              'nombre':'Blanco',
              'valor': '#FFFFFF'
            }
          ];
        }
    }
})();
