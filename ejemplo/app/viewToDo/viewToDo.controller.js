(function() {

    angular
        .module('app.viewToDo')
        .controller('viewController', viewController);

    viewController.$inject = ['datafactory', '$state'];

    /* @ngInject */
    function viewController(datafactory, $state) {
        var vm = this;

        vm.toDos = [];
        vm.markAsDone = markAsDone;
        vm.editToDo = editToDo;

        activate();

        ///////////////////////////////////

        function activate(){
          vm.toDos = getToDos();
        }

        function getToDos() {
          return datafactory.getToDos();
        }

        function markAsDone (task){
          console.log(task);
          datafactory.markAsDone(task.id);
        }

        function editToDo(task) {
          $state.go(
            'edit',
            {
              toDoId: task.id
            }
          );
        }
    }
})();
