App.controller('CustomersController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getCustomerList = function () {
        $.post(MY_CONSTANT.url + '/customer_list', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            //console.log(data);
            data.forEach(function (column) {

                var d = {
                    cust_id: "",
                    name: "",
                    phone_no: "",
                    email: "",
                    gender: "",
                    reg_date: "",
                    is_block: ""
                };

                d.cust_id = column.user_id;
                d.name = column.first_name + " " + column.last_name;
                d.phone_no = column.mobile;
                d.email = column.email;
                d.gender = column.gender;
                d.reg_date = column.registration_datetime;
                d.is_block = column.is_block;
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
                    dtInstance = $('#datatable2').dataTable({
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

    getCustomerList();

    // Delete Dialog
    $scope.deleteCustomer = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_user',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                user_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

    // Change Status Dialog
    $scope.changeStatus = function (status, userid) {
        $scope.user_val = userid;
        if (status == 1) {
            $scope.stat = "block";
            $scope.stat_btn = "Block";
            $scope.status = 1;
        }
        else {
            $scope.stat = "unblock";
            $scope.stat_btn = "Unblock";
            $scope.status = 0;
        }
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/status-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.change = function () {

        $.post(MY_CONSTANT.url + '/block_unblock_user',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                user_id: $scope.user_val,
                new_block_status: $scope.status
            },
            function (data) {
                console.log(data);
                $window.location.reload();

            });
    };


});

App.controller('CustomerInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $stateParams) {
    'use strict';
    $scope.loading = true;
    $scope.loading_image = true;
    $scope.customer = {};
    var userId = $stateParams.id;
    $.post(MY_CONSTANT.url + '/customer_details', {
        access_token: $cookieStore.get('obj').accesstoken,
        user_id: userId

    }, function (data) {
        var dataArray = [];
        data = JSON.parse(data);
        console.log(data);

        var customer_data = data.customer_detail[0];

        $scope.customer.image = customer_data.image_url;
        $scope.customer.name = customer_data.name;
        $scope.customer.email = customer_data.email;
        $scope.customer.phone = customer_data.mobile;
        $scope.loading_image = false;

        data = data.services;
        data.forEach(function (column) {

            var d = {
                id: "",
                booking_id: "",
                service_id: "",
                address: "",
                artist_name: "",
                service_date: "",
                start_time: "",
                end_time: "",
                status: "",
                rating: "",
                cost: "",
                category: "",
                service_name: ""
            };

            var date = column.service_date.toString().split("T")[0];
            var startTimeHours = column.start_time.split(":")[0];
            var startTimeMinutes = column.start_time.split(":")[1];
            var startSuffix = startTimeHours >= 12 ? "PM" : "AM",
                starthours12 = startTimeHours % 12;
            var startDisplayTime = starthours12 + ":" + startTimeMinutes + " " + startSuffix;
            //console.log(startDisplayTime);
            var endTimeHours = column.end_time.split(":")[0];
            var endTimeMinutes = column.end_time.split(":")[1];
            var endSuffix = endTimeHours >= 12 ? "PM" : "AM",
                endhours12 = startTimeHours % 12;
            var endDisplayTime = endhours12 + ":" + endTimeMinutes + " " + endSuffix;
            d.id = column.id;
            d.booking_id = column.booking_id;
            d.service_id = column.service_id;
            d.status = column.status;
            d.artist_name = column.artist_name;
            d.start_time = startDisplayTime;
            d.end_time = endDisplayTime;
            d.address = column.address;
            d.service_date = date;
            d.rating = column.rating;
            d.cost = column.cost;
            d.category = column.category;
            d.service_name = column.service_name;
            dataArray.push(d);
        });

        $scope.$apply(function () {
            $scope.list = dataArray;


            // Define global instance we'll use to destroy later
            var dtInstance;
            $scope.loading = false;
            $timeout(function () {
                if (!$.fn.dataTable) return;
                dtInstance = $('#datatable2').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
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

});