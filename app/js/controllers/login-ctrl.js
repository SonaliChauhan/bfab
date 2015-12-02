App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.account = {};
    $scope.authMsg = '';

    $scope.loginAdmin = function () {
        $scope.authMsg = '';
        $.post(MY_CONSTANT.url + '/admin_login',
            {
                user_email: $scope.account.email,
                password: $scope.account.password
            }).then(
            function (data) {
                data = JSON.parse(data);
                console.log(data);
                if (data.error) {
                    $scope.authMsg = data.error;
                    $scope.$apply();
                } else {
                    var someSessionObj = {'accesstoken': data.access_token};
                    $cookieStore.put('obj', someSessionObj);
                    $state.go('app.customers');
                }
            });
    };

    $scope.recover = function () {

        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);
                console.log(data);
                if (data.status == 200) {
                    $scope.successMsg = data.message.toString();
                } else {
                    $scope.errorMsg = data.message.toString();

                }
                $scope.$apply();
            })
    };

    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }
});

