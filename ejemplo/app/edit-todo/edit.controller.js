(function() {
    'use strict';

    angular
        .module('app.editToDo')
        .controller('EditController', EditController);

    EditController.$inject = ['datafactory', '$state','$stateParams'];

    /* @ngInject */
    function EditController(datafactory, $state, $stateParams) {

        var vm = this;

        vm.colors = null;
        vm.save = save;
        vm.toDo = null;

        activate();

        ////////////////////

        function save() {
          datafactory.updateToDo(vm.toDo);
          //TODO usar promesa y redirigir en then()
          $state.go('view');
        }

        function activate() {
          vm.toDo = datafactory.getToDoById($stateParams.toDoId);
          if(vm.toDo === null){
            $state.go('view');
          }
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
