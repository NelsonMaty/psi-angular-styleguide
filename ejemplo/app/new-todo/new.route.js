(function() {
  angular
    .module('app.newToDo')
    .config(config);

    function config($stateProvider) {

      $stateProvider
      .state('new', {
        url: "/new",
        templateUrl: "app/new-todo/new.html",
        controller: 'NewController',
        controllerAs: 'vm',
        title: 'Nueva tarea'
      });
    }
}());
