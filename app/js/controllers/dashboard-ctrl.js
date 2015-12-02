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

App.controller('FlotChartController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, ChartData, $timeout) {
    'use strict';

    // LINE
    // -----------------------------------
    $scope.lineData = [];
    $scope.lineData2 = [];
    $.post(MY_CONSTANT.url + '/sales_graph', {
        access_token: $cookieStore.get('obj').accesstoken

    }, function (data) {
        $scope.lineData.push(data);
        $scope.$apply();
    });

    $.post(MY_CONSTANT.url + '/bookings_graph', {
        access_token: $cookieStore.get('obj').accesstoken

    }, function (data) {
        $scope.lineData2.push(data);
        $scope.$apply();
    });

    //$scope.lineData = ChartData.load('server/chart/line.json');
    $scope.lineOptions = {
        series: {
            lines: {
                show: true,
                fill: 0.01
            },
            points: {
                show: true,
                radius: 4
            }
        },
        grid: {
            borderColor: '#eee',
            borderWidth: 1,
            hoverable: true,
            backgroundColor: '#fcfcfc'
        },
        tooltip: true,
        tooltipOpts: {
            content: function (label, x, y) {
                return x + ' : ' + y;
            }
        },
        xaxis: {
            tickColor: '#eee',
            mode: 'categories'
        },
        yaxis: {
            position: ($scope.app.layout.isRTL ? 'right' : 'left'),
            tickColor: '#eee'
        },
        shadowSize: 0
    };

    // Generate random data for realtime demo
    var data = [], totalPoints = 300;

    update();

    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);
        // Do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]]);
        }
        return [res];
    }

    function update() {
        $scope.realTimeData = getRandomData();
        $timeout(update, 30);
    }

    // end random data generation


}).service('ChartData', ["$resource", function ($resource) {

    var opts = {
        get: {method: 'GET', isArray: true}
    };
    return {
        load: function (source) {
            return $resource(source, {}, opts).get();
        }
    };
}]);