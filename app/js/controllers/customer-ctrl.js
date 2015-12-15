App.controller('CustomersController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;

    $scope.options = [10,25,50,100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function(column, dataArray, index) {
        var d = {
            cust_id: "",
            name: "",
            phone_no: "",
            email: "",
            gender: "",
            registration_datetime: "",
            is_block: ""
        };

        d.cust_id = column.user_id;
        d.name = column.first_name + " " + column.last_name;
        d.phone_no = column.mobile;
        d.email = column.email;
        d.gender = column.gender?column.gender:"not defined";
        d.reg_date = column.registration_datetime;
        d.is_block = column.is_block;
        dataArray.push(d);

    };
    var createPageArray = function(start, end) {
        var page_arr = [];
        start = start<2?2:start;
        end = end>$scope.total_pages-1?$scope.total_pages-1:end;
        for(var i=start;i<=end;i++) {
            page_arr.push(i);
        }
        $scope.pages = page_arr;
    };
    $scope.getCustomerList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/customer_list_paging', {
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
$scope.getCustomerList($scope.page_no);

// ****Search in customer list***//
var getCustomers = function() {
    $.post(MY_CONSTANT.url + '/customer_list', {
        access_token: $cookieStore.get('obj').accesstoken
    }, function (data) {
        var dataArray = [];
        data = JSON.parse(data);
        completeList = data;
    });
};
getCustomers();

$scope.searchResults = function(start, end, page) {
    if(searchArray.length!=completeList.length) {
        var filteredArray = [];
        $scope.pageLoaded = false;
        $scope.searchPaging = true;
        $scope.page_no = page;
        end = end>searchArray.length?searchArray.length:end;
        $scope.total_pages = Math.ceil(searchArray.length/$scope.page_length);
        createPageArray(0, $scope.total_pages);
        for(var i=start;i<end;i++) {
            filteredArray.push(searchArray[i]);
        }
        $scope.list = filteredArray;
    }
    else {
        $scope.searchPaging = false;
        $scope.pageLoaded = true;
        $scope.getCustomerList(1);
    }
};
// Search for data
$scope.$watch('search', function(value) {
    $scope.page_no = 1;
    searchArray = [];
    var index = 0;
    if(!completeList.length)
        getCustomers();
    else {
        completeList.forEach(function(column) {
            var found = column.first_name.toLowerCase().search(value)>-1 || column.last_name.toLowerCase().search(value)>-1;
            found = found || column.registration_datetime.toLowerCase().search(value)>-1 || column.email.toLowerCase().search(value)>-1;
            found = found || column.mobile.search(value)>-1;
            if(found)
                putData(column, searchArray, ++index);
        });
        $scope.searchResults(0, $scope.page_length, $scope.page_no);
    }
});
//****************************//

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

                service_id: "",
                address: "",
                artist_name: "",
                service_date: "",
                start_time: "",
                end_time: "",
                status: "",
                rating: "",
                cost: "",
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
            d.service_id = column.service_id;
            d.status = column.status;
            d.artist_name = column.artist_name;
            d.start_time = startDisplayTime;
            d.end_time = endDisplayTime;
            d.service_location = column.address;
            d.service_date = column.service_date;
            d.rating = column.rating;
            d.cost = column.cost;
            d.service_name = column.service_name;
            dataArray.push(d);
        });

        $scope.$apply(function () {
            $scope.list = dataArray;

            var dtInstance;
            $scope.loading = false;
            $timeout(function () {
                if (!$.fn.dataTable) return;
                dtInstance = $('#datatable2').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    'columnDefs':[{'targets':[6,13,15], visible: false}],
                    'iDisplayLength': 5,
                    "aLengthMenu": [[5, 10, 15, 20], [5, 10, 15, 20]],
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
                var colvis = new $.fn.dataTable.ColVis( dtInstance, {
                    buttonText: 'Select columns',
                    exclude: [0,1,7,8,9]
                } );

                $( colvis.button() ).prependTo('#datatable2_filter');
                var inputSearchClass = 'datatable_input_col_search';
                var columnInputs = $('tfoot .' + inputSearchClass);

                // On input keyup trigger filtering
                columnInputsjjg
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