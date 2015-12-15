App.controller('PaymentController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, $timeout) {
    'use strict';
    $scope.loading = true;
    $.post(MY_CONSTANT.url + '/artist_payment_detail', {
        access_token: $cookieStore.get('obj').accesstoken

    }, function (data) {
        var dataArray = [];
        data = JSON.parse(data);
        console.log(data);
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
       // data = data.artist_details;
        data.forEach(function (column) {
            console.log(column);
            var d = {
                artist_id: "",
                artist_name: "",
                email: "",
                current_income: "",
                total_income: "",
                bank_name:"",
                account_no:"",
                account_holder_name:""
            };

            d.artist_id = column.artist_id;
            d.artist_name = column.artist_name;
            d.artist_email = column.email;
            d.account_holder_name=column.account_holder_name;
            d.bank_name=column.bank_name;
            d.account_no=column.account_no;
            d.current_income = column.current_income;
            d.total_income = column.total_income;
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

App.controller('PaymentInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, $stateParams, convertdatetime, getCategories) {
    'use strict';
    $scope.loading = true;
    var userId = $stateParams.id;
    $.post(MY_CONSTANT.url + '/artist_payment_details', {
        access_token: $cookieStore.get('obj').accesstoken,
        user_id: userId

    }, function (data) {
        var dataArray = [];
        data = JSON.parse(data);
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
        data = data.services;
        data.forEach(function (column) {
            //console.log(column)
            var d = {
                id: "",
                booking_id: "",
                service_id: "",
                address: "",
                customer_name: "",
                service_date: "",
                start_time: "",
                end_time: "",
                status: "",
                rating: "",
                cost: "",
                category: "",
                service_name: "",
                date_created: ""
            };

            var date = column.service_date.toString().split("T")[0];
            var start_time = convertdatetime.convertTime(column.start_time);
            var end_time = convertdatetime.convertTime(column.end_time);
            var service_list = getCategories.category(column.treatments);
            var category = getCategories.category(column.categories);

            d.id = column.id;
            d.booking_id = column.booking_id;
            d.service_id = column.service_id;
            d.status = column.status;
            d.customer_name = column.customer_name;
            d.start_time = start_time;
            d.end_time = end_time;
            d.address = column.address;
            d.service_date = date;
            d.rating = column.rating;
            d.cost = column.cost;
            d.category = category;
            d.service_name = service_list;
            d.date_created = column.transaction_created_at.toString().split("T")[0];
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