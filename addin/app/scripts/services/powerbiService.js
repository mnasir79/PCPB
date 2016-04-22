'use strict'

angular.module('powerbiService', ['ngRoute', 'AdalAngular'])

    .config(['$routeProvider', '$httpProvider', '$sceDelegateProvider', 'adalAuthenticationServiceProvider', 
        
        function ($routeProvider, $httpProvider, $sceDelegateProvider, adalProvider) {
            
            // Current application: https://manage.windowsazure.com/inin.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/8d07eb62-a903-4bae-bcc2-66c244e76b27/ClientApp/6f60f173-c3b4-4b4f-888e-75f981b7353e/clientAppConfigure
            adalProvider.init({
                tenant: 'inin.onmicrosoft.com',
                //clientId: '32cd11e1-9f38-42e2-a11c-7c11df10e81d', // From dev.powerbi.com/apps
                clientId: '6f60f173-c3b4-4b4f-888e-75f981b7353e', // From Azure Management Portal
                extraQueryParameter: 'nux=1',
                endpoints: {
                    "https://api.powerbi.com/beta/myorg": "https://analysis.windows.net/powerbi/api",
                },
                //reply address is: https://login.live.com/oauth20_desktop.srf
                requireADLogin: true,
                cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
            }, $httpProvider);
            
            // The Power BI REST endpoint needs to be added and white-listed to enable authenticated CORS REST calls
            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'https://*.powerbi.com/**'
            ]);
    }])
    
    .service('powerbiService', ['$http', '$q', function ($http, $q) {
        
        return {
            getDashboards: getDashboards
        };
        
        function getUrl(path) {
            return "https://api.powerbi.com/beta/myorg/" + path // Cors only enabled on beta
        }
        
        function getDashboards()
        {
            var deferred = $q.defer();

            $http({
                url: getUrl('dashboards'),
                method: 'GET',
                withCredentials: true
            }).success(function (response) {
                console.log(response);
                deferred.resolve(response);
            }).error(function (err, e) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }])