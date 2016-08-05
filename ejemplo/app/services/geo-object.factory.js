(function() {
    'use strict';

    angular
        .module('ejemplo.services')
        .factory('geoObjectFactory', geoObjectFactory);

    geoObjectFactory.$inject = [];

    /* @ngInject */
    function geoObjectFactory() {
        var service = {
            function: getCountries
        };

        return service;

        function getCountries() {

        }
    }
})();
