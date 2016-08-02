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
        templateUrl: "app/editToDo/editToDo.view.html",
        controller: 'EditController',
        controllerAs: 'vm',
        title: 'Edición de tarea'
      });
    }
}());
