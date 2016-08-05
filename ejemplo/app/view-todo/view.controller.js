(function() {

    angular
        .module('ejemplo.viewToDo')
        .controller('ViewController', ViewController);

    ViewController.$inject = ['ejemploFactory', '$state'];

    /* @ngInject */
    function ViewController(ejemploFactory, $state) {
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
          return ejemploFactory.getToDos();
        }

        function markAsDone (task){
          console.log(task);
          ejemploFactory.markAsDone(task.id);
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
