(function() {
  angular
    .module('app.newToDo')
    .config(config);

    function config($stateProvider) {

      $stateProvider
      .state('new', {
        url: "/new",
        templateUrl: "app/newToDo/newToDo.view.html",
        controller: 'newController',
        controllerAs: 'vm',
        title: 'Nueva tarea'
      });
    }
}());
