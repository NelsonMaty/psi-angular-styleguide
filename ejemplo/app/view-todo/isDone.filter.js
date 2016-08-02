(function() {
    'use strict';

    angular
        .module('app.viewToDo')
        .filter('isDone', filter);

    function filter() {
        return filterFilter;

        function filterFilter(item) {
            return item.done===false;
        }
    }
})();
