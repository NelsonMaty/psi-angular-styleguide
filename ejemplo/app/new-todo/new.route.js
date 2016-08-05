(function() {
  angular
    .module('ejemplo.newToDo')
    .config(config);

    config.$inject = ['$stateProvider'];

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
