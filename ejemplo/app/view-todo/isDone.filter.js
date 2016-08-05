(function() {
    'use strict';

    angular
        .module('ejemplo.viewToDo')
        .filter('isDone', filter);

    function filter() {
        return filterFilter;

        function filterFilter(item) {
            return item.done===false;
        }
    }
})();
