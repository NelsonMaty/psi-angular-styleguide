(function() {
    'use strict';

    angular
        .module('ejemplo.services')
        .factory('ejemploFactory', ejemploFactory);

    ejemploFactory.$inject = [];

    /* @ngInject */
    function ejemploFactory() {

        var todos = [];

        var generateId = 100;

        var factory = {
            getToDos: getToDos,
            removeToDo: removeToDo,
            editToDo: editToDo,
            addToDo: addToDo,
            markAsDone: markAsDone,
            getToDoById: getToDoById,
            updateToDo: updateToDo,
            saveToDo: saveToDo
        };

        populate();
        return factory;

        ////////////////////////////

        function populate() {
          todos = [
            {
              id:5,
              color: '#FFD180',
              titulo:'Pick',
              descripcion:'Pick a language to learn',
              done:true
            },
            {
              id:6,
              color: "#FFD180",
              titulo:'Radio',
              descripcion:'Listen to radio broadcasts in the language',
              done:true
            },
            {
              id:7,
              color: "#FFFF8D",
              titulo:'Movies',
              descripcion:'Create a list of movies and shows to watch',
              done:true
            },
            {
              id:0,
              color: "#CFD8DC",
              titulo:'Trip',
              descripcion:'Plan a trip to location where language is spoken',
              done:true
            },
            {
              id:1,
              color: "#80D8FF",
              titulo:'Schedule',
              descripcion:'Establish a daily study schedule',
              done:false
            },
            {
              id:2,
              color: '#CCFF90',
              titulo:'Books',
              descripcion:'Find books to read in your chosen language',
              done:false
            },
            {
              id:4,
              color: "#FFFFFF",
              titulo:'Card grande',
              descripcion:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              done:false
            },
            {
              id:3,
              color: '#CFD8DC',
              titulo:'Dictionary',
              descripcion:'Buy a language dictionary',
              done:false
            },
            {
              id:8,
              color:"#80D8FF",
              titulo:'Speakers',
              descripcion:'Sign up to practice with native speakers',
              done:false
            },
            {
              id:9,
              color:"#FF8A80",
              titulo:'Move',
              descripcion:'Move cards from ToDo once I have done them',
              done:false
            }
          ];
        }

        function getToDos() {
          return todos;
        }

        function removeToDo(id) {
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              todos.splice(i, 1);
              break;
            }
          }
        }

        function editToDo(todo) {
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              todos.splice(i, 1, todo);
              break;
            }
          }
        }

        function addToDo(todo) {
          todos.push(todo);
        }

        function markAsDone(id) {
          var toDo;
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              toDo = todos.splice(i, 1)[0];
              toDo.done = true;
              todos.unshift(toDo);
              break;
            }
          }
        }

        function getToDoById(id) {
          var toDo = null;
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              toDo = todos[i];
              break;
            }
          }
          return toDo;
        }

        function updateToDo(todo) {
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === todo.id) {
              todos.splice(i, 1, todo);
              break;
            }
          }
        }

        function saveToDo(todo) {
          todo.id = generateId++;
          todos.unshift(todo);
        }
    }
})();
