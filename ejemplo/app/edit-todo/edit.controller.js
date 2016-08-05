(function() {
    'use strict';

    angular
        .module('ejemplo.editToDo')
        .controller('EditController', EditController);

    EditController.$inject = ['dataFactory', '$state','$stateParams'];

    /* @ngInject */
    function EditController(datafactory, $state, $stateParams) {

        var vm = this;

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
        }
    }
})();
