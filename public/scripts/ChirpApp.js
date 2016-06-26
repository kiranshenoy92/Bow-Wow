var app = angular.module('chirpApp', ['ngRoute','ngResource','ngStorage'])

.run(function($rootScope,$http,$localStorage){
    //var user = $cookies.getObject('user');
    $rootScope.$storage = $localStorage.$default({
          user: null
        });
    $rootScope.$storage = $localStorage.$default({
          auth: false
        });

    if($rootScope.$storage.user==null){
    $rootScope.authenticated = false;
    $rootScope.current_user = { username: '', password: '', mobile:'', firstName: '', secondName: '' , gender :'', aoutYou :''};
  } else {
    $rootScope.authenticated = true;
    $rootScope.current_user = $rootScope.$storage.user;
  }
  $rootScope.registration_message = '';

   $rootScope.signout = function(){
    $http.get('/logout');
    
    $rootScope.authenticated = false;
    $rootScope.current_user = { username: '', password: '', mobile:'', firstName: '', secondName: '' , gender :'', aoutYou :''};
    $rootScope.$storage.user = null;
    $rootScope.$storage.auth = false;
  };
});

app.factory('postService', function($resource){
  return $resource('/posts/:id');
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })

    //the signup display
    .when('/signup', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

app.controller('mainController', function ($scope,postService,$rootScope,$http){
    $scope.posts = postService.query();
    $scope.newPost = {created_by:'' , text:'' , created_at:'', _id:''};

    console.log($rootScope.authenticated);
    $scope.currentPage = 0;
    $scope.pageSize = 8;
    $scope.numberOfPages = function(){
        return Math.ceil($scope.posts.length/$scope.pageSize);                
    }
    
    $scope.post = function () {
        $scope.newPost.created_by = $rootScope.current_user.username;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost,function(){
            $scope.posts = postService.query();
            $scope.newPost = {created_by:'' , text:'' , created_at:''};
        })  
    }


    $scope.delete = function (id) {
            $http.delete('/post/'+id).then(function (data) {
            $scope.posts = postService.query();
        });
   // console.log(data);
    }

});
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('authController', function ($scope, $http, $rootScope, $location,$localStorage) {
    $scope.user = { username: '', password: '', mobile:'', firstName: '', secondName: '' , aoutYou :''};
    $scope.error_message = '';
    $scope.regex = /[A-Za-z0-9]+/;
    $scope.mobilePattern = /[7-9][0-9]{9}/;
    $scope.passwordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w]))(.{8,15})$/;
   
    $scope.login = function () {

        $http.post('/login', $scope.user).success(function(data){
            if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user.username = data.user.secure.username;
            $rootScope.current_user.firstName = data.user.personal.fname;
            $rootScope.current_user.secondName = data.user.personal.sname;
            $rootScope.$storage.user = $rootScope.current_user;
            $location.path('/');
            }
            else{
            $rootScope.registration_message =""
            $scope.error_message = data.message;
            }
        });
    }
    
    $scope.register = function () {
         $rootScope.registration_message =""
         if($scope.registrationForm.fname.$invalid){
                $scope.error_message="First name is not valid";
         }
         else if($scope.registrationForm.sname.$invalid){
                $scope.error_message="Second name is not valid";
         }
         else if($scope.registrationForm.password.$invalid){
                $scope.error_message="Password is not valid. Password should contain min 8 and max 15 characters and atleast one capital letter,small letter,number and a special character ";
         }  
         else if($scope.registrationForm.mobile.$invalid){
                $scope.error_message="Mobile number is not valid";
         } else {
         $http.post('/signup', $scope.user).success(function(data){
            if(data.state == 'success'){
            //$rootScope.authenticated = true;
            //$rootScope.current_user = data.user.username;
            $rootScope.registration_message = 'Registration successful';
            $location.path('/login');
            }
            else{
                
                $scope.error_message = data.message;
            }
        });
     }
    };
    
})