(function() {
    'use strict';

    angular
        .module('ejemplo.editToDo')
        .controller('EditController', EditController);

    EditController.$inject = ['ejemploFactory', '$state','$stateParams'];

    function EditController(ejemploFactory, $state, $stateParams) {

        var vm = this;

        vm.save = save;
        vm.toDo = null;

        activate();

        ////////////////////

        function save() {
          ejemploFactory.updateToDo(vm.toDo);
          //TODO usar promesa y redirigir en then()
          $state.go('view');
        }

        function activate() {
          vm.toDo = ejemploFactory.getToDoById($stateParams.toDoId);
          if(vm.toDo === null){
            $state.go('view');
          }
        }
    }
})();
