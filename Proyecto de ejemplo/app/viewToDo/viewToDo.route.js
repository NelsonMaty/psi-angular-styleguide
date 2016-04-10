(function() {
  angular
    .module('app.viewToDo')
    .config(config);

    function config($stateProvider) {

      $stateProvider
      .state('view', {
        url: "/view",
        templateUrl: "app/viewToDo/viewToDo.view.html",
        controller: 'viewController',
        controllerAs: 'vm',
        title: 'Listado de tareas'
      });
    }
}());
