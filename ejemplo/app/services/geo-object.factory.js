(function() {
    'use strict';

    angular
        .module('ejemplo.services')
        .factory('geoObjectFactory', geoObjectFactory);

    geoObjectFactory.$inject = [];

    function geoObjectFactory() {
        var service = {
            function: getCountries
        };

        return service;

        function getCountries() {

        }
    }
})();
