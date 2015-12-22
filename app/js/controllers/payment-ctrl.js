App.controller('PaymentController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, $timeout, $window) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.index=0;

    $scope.options = [10,25,50,100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function (column, dataArray, index) {
        var d = {
            index: "",
            artist_id: "",
            artist_name: "",
            email: "",
            bank_account: "",
            weekly_earnings:"",
            total_earnings:""
        };
        d.index = index;
        d.artist_id = column.artist_id;
        d.artist_name = column.artist_name;
        d.artist_email = column.email;
        d.bank_account = column.bank_account;
        d.weekly_earnings = column.weekly_earnings;
        d.total_earnings = column.total_earnings;
        dataArray.push(d);
    };
    var createPageArray = function (start, end) {
        var page_arr = [];
        start = start < 2 ? 2 : start;
        end = end > $scope.total_pages - 1 ? $scope.total_pages - 1 : end;
        for (var i = start; i <= end; i++) {
            page_arr.push(i);
        }
        $scope.pages = page_arr;
    };
    $scope.getArtistpaymentdetailList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/artist_payment_detail_paging', {
            access_token: $cookieStore.get('obj').accesstoken,
            page_no: page_number,
            length: $scope.page_length
        }, function (data) {
            var dataArray = [];
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
            $scope.total_pages = Math.ceil(data.count / $scope.page_length);
            data.data.forEach(function (column) {
                putData(column, dataArray, ++index);

            });

            $scope.$apply(function () {
                $scope.list = dataArray;
                $scope.loading = false;
                if ($scope.total_pages > 7) {
                    if ($scope.page_no == 1) {
                        start = 2;
                        end = $scope.total_pages > 6 ? 5 : $scope.total_pages;
                    }
                    else {
                        if ($scope.page_no != $scope.last_page) {
                            if ($scope.last_page < $scope.page_no) {
                                start = $scope.page_no - 1;
                                end = $scope.page_no + 2;
                            }
                            else {
                                start = $scope.page_no - 2;
                                end = $scope.page_no + 1;
                            }
                        }
                    }
                }
                else {
                    start = 2;
                    end = $scope.total_pages;
                }
                createPageArray(start, end);
                $scope.searchPaging = false;
                $scope.pageLoaded = true;
            });
        });
    };
    $scope.getArtistpaymentdetailList($scope.page_no);

// ****Search in customer list***//
    var getArtistpaymentdetail = function () {
        $.post(MY_CONSTANT.url + '/artist_payment_detail', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
    getArtistpaymentdetail();

    $scope.searchResults = function (start, end, page) {
        if (searchArray.length != completeList.length) {
            var filteredArray = [];
            $scope.pageLoaded = false;
            $scope.searchPaging = true;
            $scope.page_no = page;
            end = end > searchArray.length ? searchArray.length : end;
            $scope.total_pages = Math.ceil(searchArray.length / $scope.page_length);
            createPageArray(0, $scope.total_pages);
            for (var i = start; i < end; i++) {
                filteredArray.push(searchArray[i]);
            }
            $scope.list = filteredArray;
        }
        else {
            $scope.searchPaging = false;
            $scope.pageLoaded = true;
            $scope.getArtistpaymentdetailList(1);
        }
    };
// Search for data
    $scope.$watch('search', function (value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        value=value.toLowerCase();
        if (!completeList.length)
            getArtistpaymentdetail();
        else {
            completeList.forEach(function (column) {
                var found = column.artist_name.toLowerCase().search(value) > -1;
                found = found || column.bank_account.toLowerCase().search(value) > -1 || column.email.toLowerCase().search(value) > -1;
                if (found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
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