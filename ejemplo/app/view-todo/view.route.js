(function() {
  angular
    .module('ejemplo.viewToDo')
    .config(config);

    config.$inject = ['$stateProvider']; 

    function config($stateProvider) {

      $stateProvider
      .state('view', {
        url: "/view",
        templateUrl: "app/view-todo/view.html",
        controller: 'ViewController',
        controllerAs: 'vm',
        title: 'Listado de tareas'
      });
    }
}());
