App.controller('DashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT) {
    'use strict';
    $scope.loading = true;
    $scope.current = {};
    $scope.gross = {};
    $scope.registered = {};
    $.post(MY_CONSTANT.url + '/dashboard', {
        access_token: $cookieStore.get('obj').accesstoken

    }, function (data) {
        data = JSON.parse(data);
        if (data.error) {
            ngDialog.open({
                template: '<p>Something went wrong !</p>',
                className: 'ngdialog-theme-default',
                plain: true,
                showClose: false,
                closeByDocument: false,
                closeByEscape: false
            });
            return false;
        }

        //console.log(data);
        $scope.current.totalrevenue = data.daily_revenue;
        $scope.current.servicescompleted = data.daily_completed;
        $scope.current.servicesscheduled = data.daily_pending;

        $scope.gross.totalrevenue = data.total_revenue;
        $scope.gross.servicescompleted = data.total_completed;
        $scope.gross.servicesscheduled = data.total_pending;

        $scope.registered.users = data.total_users;
        $scope.registered.sp = data.total_technicians;
        $scope.$apply();

    });

});
/**=========================================================
 * Module: flot-chart.js
 * Setup options and data for flot chart directive
 =========================================================*/

