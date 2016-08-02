(function() {
  angular
    .module('app.editToDo')
    .config(config);

    function config($stateProvider) {

      $stateProvider
      .state('edit', {
        url: "/edit",
        params: {
          toDoId: null
        },
        templateUrl: "app/edit-todo/edit.html",
        controller: 'EditController',
        controllerAs: 'vm',
        title: 'Edición de tarea'
      });
    }
}());
