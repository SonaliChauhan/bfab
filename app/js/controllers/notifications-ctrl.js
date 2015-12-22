App.controller('getNotifications', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $interval) {
    'use strict';

    var getNotifications = function () {
        $.post(MY_CONSTANT.url + '/get_notifications',
            {

                access_token: $cookieStore.get('obj').accesstoken
            },
            function (data) {
                var data = JSON.parse(data);
                //console.log(data);
                $scope.unread_count = data.unread_count;
                $scope.$apply();

            });
    };

    getNotifications();

    //$interval runs the given function every X millisec (2nd arg)
    //$interval(function () {
    //    getNotifications();
    //}, $scope.refreshInterval * 50000); // the refresh interval must be in millisec

});

App.controller('NotificationsController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var readNotifications = function () {
        $.post(MY_CONSTANT.url + '/read_notifications',
            {

                access_token: $cookieStore.get('obj').accesstoken,
                all: 1
            },
            function (data) {
                var data = JSON.parse(data);
                //console.log(data);
                $scope.unread_count = data.unread_count;
                $scope.$apply();

            });
    };

    readNotifications();


    var getNotificationsList = function () {
        $.post(MY_CONSTANT.url + '/get_notifications', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            data = data.notifications;
            //console.log(data);
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
            data.forEach(function (column) {

                var d = {
                    booking_id: "",
                    message: "",
                    color: "",
                    txt_color: ""
                };

                if (column.read_status == 0) {
                    var color = "#F6D9DF";
                    var txt_color = "#FFFFFF";
                } else {
                    color = "#FFFFFF";
                    txt_color = "#656565";
                }
                d.booking_id = column.booking_id;
                d.message = column.message;
                d.color = color;
                d.txt_color = txt_color;
                dataArray.push(d);

            });

            $scope.$apply(function () {
                $scope.list = dataArray;


                // Define global instance we'll use to destroy later
                var dtInstance;
                $scope.loading = false;
                $timeout(function () {
                    if (!$.fn.dataTable)
                        return;
                    dtInstance = $('#notifications_table').dataTable({
                        'paging': true, // Table pagination
                        'ordering': true, // Column ordering
                        'info': true, // Bottom left status text
                        'bDestroy': true,
                        // Text translation options
                        // Note the required keywords between underscores (e.g _MENU_)
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        }
                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });

                // When scope is destroyed we unload all DT instances
                // Also ColVis requires special attention since it attaches
                // elements to body and will not be removed after unload DT
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                });
            });

        });
    };

    getNotificationsList();

    $scope.clearNotifications = function () {
        $.post(MY_CONSTANT.url + '/delete_notifications',
            {

                access_token: $cookieStore.get('obj').accesstoken
            },
            function (data) {
                ngDialog.open({
                    template: '<p>Notifications cleared successfully !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false
                });
                $timeout($window.location.reload(), 2500);

            });
    };

});