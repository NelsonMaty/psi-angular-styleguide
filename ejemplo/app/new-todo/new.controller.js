(function() {
    'use strict';

    angular
        .module('ejemplo.newToDo')
        .controller('NewController', NewController);

    NewController.$inject = ['ejemploFactory','$state'];

    function NewController(ejemploFactory, $state) {

        var vm = this;

        vm.colors = null;
        vm.save = save;
        vm.toDo = null;

        activate();

        ////////////////////

        function save() {
          ejemploFactory.saveToDo(vm.toDo);
          //TODO usar promesa y redirigir en then()
          $state.go('view');
        }

        function activate() {
          vm.toDo = {
            titulo:"",
            descripcion:"",
            color:"#FFFFFF",
            done:false
          };

          vm.colors = [
            {
              'nombre':'Rojo',
              'valor': '#FF8A80'
            },
            {
              'nombre':'Naranja',
              'valor': '#FFD180'
            },
            {
              'nombre':'Verde',
              'valor': '#CCFF90'
            },
            {
              'nombre':'Amarillo',
              'valor': '#FFFF8D'
            },
            {
              'nombre':'Gris',
              'valor': '#CFD8DC'
            },{
              'nombre':'Azul',
              'valor': '#80D8FF'
            },
            {
              'nombre':'Blanco',
              'valor': '#FFFFFF'
            }
          ];
        }

    }
})();
