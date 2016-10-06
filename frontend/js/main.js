var app = angular.module('DigiApp', ['ui.router', 'satellizer', 'toastr']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/static/partials/home.html'
                // data: {requiredLogin: true}        
        })
        .state('signup', {
            url: '/signup',
            templateUrl: '/static/partials/signup.html',
            controller: 'LoginSignupCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/static/partials/login.html',
            controller: 'LoginSignupCtrl'
        });

    $authProvider.loginUrl = '/auth/login/';
    $authProvider.signupUrl = '/auth/signup/';        
});

app.run(function($rootScope, $state, $auth) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState) {
            var requiredLogin = false;
            if (toState.data && toState.data.requiredLogin)
                requiredLogin = true;

            if (requiredLogin && !$auth.isAuthenticated()) {
                event.preventDefault();
                $state.go('login');
            }
        });
});


app.controller('LoginSignupCtrl', function($scope, $auth, $state, toastr) {

    $scope.signUp = function() {
        $auth
            .signup($scope.formUserLogin)
            .then(function(response) {
                $auth.setToken(response);
                $state.go('home');
            })
            .catch(function(response) {
                toastr.error(
                    'Error!', { closeButton: true }
                );
            })
    };

    $scope.login = function() {
        $auth
            .login($scope.formUserLogin)
            .then(function(response) {
                $auth.setToken(response);
                $state.go('home');
            })
            .catch(function(response) {
                toastr.error(
                    'Email or password not correct!', { closeButton: true }
                );
            })
    };

    $scope.auth = function(provider) {
        $auth.authenticate(provider)
            .then(function(response) {
                console.debug("success", response);
                $state.go('secret');
            })
            .catch(function(response) {
                console.debug("catch", response);
            })
    }
});

app.controller('SecretCtrl', function($scope, $state, $auth, $http) {
    $scope.logout = function() {
        $auth.logout();
        $state.go("home");
    };

    getUserInfo();

    function getUserInfo() {
        $http.get('/user')
            .then(function(response) {
                $scope.user = response.data;
            })
            .catch(function(response) {
                console.log("getUserInfo error", response);
            })
    }
});
