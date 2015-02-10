require('angular');
require('angular-route');
require('angular-resource');
require('angular-animate');

var _ = require('lodash');
var Please = require('please');
var views = 'views/';

angular.module('vikingApp', ['ngRoute', 'ngResource', 'ngAnimate', 'basic']);

var app = angular.module('basic', []);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: views + 'front',
      controller:  'frontController'
    })
    .when('/project/:id', {
      templateUrl: views + 'project',
      controller: 'projectController'
    });
  
  // $locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.isActive = function(path) {
          if(~$location.path().indexOf(path)) {
            return true;
          }
        }
    });
}]);

app.factory('resource', ['$resource', function ($resource) {
  var api = $resource(null, {id: '@id'}, {
    getProjects: {
      method: 'GET',
      url: 'projects',
      isArray: true
    },
    getSingleProject: {
      method: 'GET',
      url: 'projects/:id'
    }
  });
  return api;
}]);

app.controller('sidebarController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'resource', function($scope, $resource, $http, $routeParams, $route, $q, $location, resource) {
  $scope.showQuote = false;
  $scope.navigation = [
    {
      url: '#/portfolio',
      title: 'Portfolio'
    },
    {
      url: '#/cv',
      title: 'CV'
    }
  ];

  $scope.socialNetworks = [
    {
      url: 'https://facebook.com/niklaslepisto',
      name: 'facebook'
    },
    {
      url: 'https://twitter.com/laznic',
      name: 'twitter'
    },
    {
      url: 'https://behance.net/niklaslepisto',
      name: 'behance'
    },
    {
      url: 'https://fi.linkedin.com/in/niklaslepisto',
      name: 'linkedin'
    },
    {
      url: 'https://github.com/laznic',
      name: 'github'
    }
  ];

}]);

app.controller('frontController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'resource', function($scope, $resource, $http, $routeParams, $route, $q, $location, resource) {
  $scope.projectsPromise = resource.getProjects().$promise;

  $q.all([$scope.projectsPromise]).then(function(data) {
    $scope.blocks = data[0];
  });

  $scope.itemClicked = false;
  $scope.selected = {};

  $scope.clickedProject = function(block) {
    // $scope.selected = resource.getSingleProject({id: block.id});
    $scope.itemClicked = true;
  };
 
}]);

app.controller('projectController', ['$scope', '$resource', '$http', '$routeParams', '$route', '$q', '$location', 'resource', function($scope, $resource, $http, $routeParams, $route, $q, $location, resource) {
  $scope.projectPromise = resource.getSingleProject({id: $routeParams.id}).$promise;
  console.log($routeParams.id);

  $q.all([$scope.projectPromise]).then(function(data) {
    $scope.selected = data[0];
    console.log($scope.selected);
  });

}]);
