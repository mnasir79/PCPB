'use strict';

angular.module("powerbiService", ['ngRoute','AdalAngular'])
    .config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', 
        function ($routeProvider, $httpProvider, adalProvider) {

            adalProvider.init(
                {
                    instance: 'https://login.windows.net/', 
                    tenant: 'common',
                    clientId: '27dc78ba-894b-46d8-bbaf-e3b7636ebcd4',
                    extraQueryParameter: 'nux=1',
                    //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
                    redirectUri: 'https://login.live.com/oauth20_desktop.srf'
                },
                    $httpProvider
                );
   
    }])
    
    .service('powerbiService', ['$scope', 'adalAuthenticationService','$location', function ($scope, adalService, $location) {
        
        $scope.login = function () {
            adalService.login();
        };
        
        $scope.logout = function () {
            adalService.logOut();
        };
        
        $scope.isActive = function (viewLocation) {        
            return viewLocation === $location.path();
        };
        
        $scope.createDataset = function () {
            
        };
        
    }])
    
    .factory('powerbiService', ['$http', function ($http) {
        return {
            getItems : function(){
                return $http.get('/api/TodoList');
            },
            getItem : function(id){
                return $http.get('/api/TodoList/' + id);
            },
            postItem : function(item){
                return $http.post('/api/TodoList/',item);
            },
            putItem : function(item){
                return $http.put('/api/TodoList/', item);
            },
            deleteItem : function(id){
                return $http({
                    method: 'DELETE',
                    url: '/api/TodoList/' + id
                });
            }
        };
    }])

    ;




