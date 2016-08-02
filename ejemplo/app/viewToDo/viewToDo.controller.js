(function() {

    angular
        .module('app.viewToDo')
        .controller('ViewController', viewController);

    viewController.$inject = ['datafactory', '$state'];

    /* @ngInject */
    function viewController(datafactory, $state) {
        var vm = this;

        vm.editToDo = editToDo;
        vm.markAsDone = markAsDone;
        vm.toDos = [];

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
