'use strict';

//Spots service used to communicate Spots REST endpoints
angular.module('spots').factory('Spots', ['$resource', function($resource) {
    return $resource('spots/:spotId', {
        spotId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);