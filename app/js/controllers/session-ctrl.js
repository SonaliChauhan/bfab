App.controller('OngoingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/ongoing_booking', {
            access_token: $cookieStore.get('obj').accesstoken

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
            data.forEach(function (column) {

                var d = {
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    address: "",
                    change_address:"",
                    customer_name: "",
                    artist_name: "",
                    service_date: "",
                    start_time: "",
                    status: "",
                    cost: "",
                    category: "",
                    service_name: ""
                };

                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    hours12 = startTimeHours % 12;
                var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.change_address = column.change_address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = displayTime;
                d.cost = column.cost;
                d.category = column.category;
                d.service_date = date;
                d.status = column.status;
                d.service_name = column.service_name;
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

    getServiceList();

    // Cancel Dialog
    $scope.cancelSession = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/cancel-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {

        $.post(MY_CONSTANT.url + '/admin_cancel_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('UpcomingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/upcoming_booking', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            data = data.bookings;
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
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    address: "",
                    customer_name: "",
                    artist_name: "",
                    service_date: "",
                    start_time: "",
                    status: "",
                    cost: "",
                    category: "",
                    service_name: "",
                    city_techs: ""
                };

                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    hours12 = startTimeHours % 12;
                var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = displayTime;
                d.cost = column.cost;
                d.category = column.category;
                d.service_date = date;
                d.status = column.status;
                d.service_name = column.service_name;
                d.city_techs = column.city_techs;
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

    getServiceList();

    // Change Status Dialog
    $scope.assignArtist = function (bookingId, artistId) {
        $scope.artistId = artistId;
        $scope.bookingId = bookingId;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/assign-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.assign = function () {

        $.post(MY_CONSTANT.url + '/assign_new_artist',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.bookingId,
                artist_id: $scope.artistId
            },
            function (data) {
                console.log(data);
                $window.location.reload();

            });
    };

    // Cancel Dialog
    $scope.cancelSession = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/cancel-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {

        $.post(MY_CONSTANT.url + '/admin_cancel_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('PastSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/past_booking', {
            access_token: $cookieStore.get('obj').accesstoken

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
            data.forEach(function (column) {

                var d = {
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    address: "",
                    customer_name: "",
                    artist_name: "",
                    service_date: "",
                    start_time: "",
                    end_time: "",
                    actual_start_time: "",
                    actual_end_time: "",
                    rating: "",
                    cost: "",
                    category: "",
                    service_name: ""
                };

                var actualStartdisplayTime = "-";
                var actualEnddisplayTime = "-";
                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var startsuffix = startTimeHours >= 12 ? "PM" : "AM",
                    starthours12 = startTimeHours % 12;
                var startdisplayTime = starthours12 + ":" + startTimeMinutes + " " + startsuffix;
                var endTimeHours = column.end_time.split(":")[0];
                var endTimeMinutes = column.end_time.split(":")[1];
                var endsuffix = endTimeHours >= 12 ? "PM" : "AM",
                    endhours12 = endTimeHours % 12;
                var enddisplayTime = endhours12 + ":" + endTimeMinutes + " " + endsuffix;
                if (column.actual_local_start_time != "" && column.actual_local_start_time != "0000-00-00 00:00:00") {
                    var actualStartTimeDate = column.actual_local_start_time.split("T")[0];
                    var actualStartTimeTime = column.actual_local_start_time.split("T")[1];
                    var actualStartTimeDateString = actualStartTimeDate.split("-");
                    var finalStartDate = actualStartTimeDateString[1] + "/" + actualStartTimeDateString[2] + "/" + actualStartTimeDateString[0];
                    var actualStartTimeTimeString = actualStartTimeTime.split(".")[0];
                    actualStartTimeTimeString = actualStartTimeTimeString.split(":");
                    var actualStartsuffix = actualStartTimeTimeString[0] >= 12 ? "PM" : "AM",
                        actualStarthours12 = actualStartTimeTimeString[0] % 12;
                    actualStartdisplayTime = actualStarthours12 + ":" + actualStartTimeTimeString[1] + " " + actualStartsuffix;
                    actualStartdisplayTime = finalStartDate + " " + actualStartdisplayTime;
                }
                if (column.actual_local_end_time != "" && column.actual_local_end_time != "0000-00-00 00:00:00") {
                    var actualEndTimeDate = column.actual_local_end_time.split("T")[0];
                    var actualEndTimeTime = column.actual_local_end_time.split("T")[1];
                    var actualEndTimeDateString = actualEndTimeDate.split("-");
                    var finalEndDate = actualEndTimeDateString[1] + "/" + actualEndTimeDateString[2] + "/" + actualEndTimeDateString[0];
                    var actualEndTimeTimeString = actualEndTimeTime.split(".")[0];
                    actualEndTimeTimeString = actualEndTimeTimeString.split(":");
                    var actualEndsuffix = actualEndTimeTimeString[0] >= 12 ? "PM" : "AM",
                        actualEndhours12 = actualEndTimeTimeString[0] % 12;
                    actualEnddisplayTime = actualEndhours12 + ":" + actualEndTimeTimeString[1] + " " + actualEndsuffix;
                    actualEnddisplayTime = finalEndDate + " " + actualEnddisplayTime;
                }
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = startdisplayTime;
                d.end_time = enddisplayTime;
                d.actual_start_time = actualStartdisplayTime;
                d.actual_end_time = actualEnddisplayTime;
                d.cost = column.cost;
                d.category = column.category;
                d.service_date = date;
                d.rating = column.rating;
                d.service_name = column.service_name;
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

    getServiceList();
});

App.controller('CancelledSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/upcoming_cancelled_booking', {
            access_token: $cookieStore.get('obj').accesstoken

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
            data.forEach(function (column) {

                var d = {
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    address: "",
                    customer_name: "",
                    artist_name: "",
                    service_date: "",
                    start_time: "",
                    status: "",
                    cost: "",
                    category: "",
                    service_name: "",
                    reason: ""
                };

                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    hours12 = startTimeHours % 12;
                var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = displayTime;
                d.cost = column.cost;
                d.category = column.category;
                d.service_date = date;
                d.status = column.status;
                d.service_name = column.service_name;
                d.reason = column.reason;
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

    getServiceList();

    $scope.assignArtist = function (bookingId, artistId) {
        var retVal = confirm("Do you want to assign this artist to this session ?");
        if (retVal == true) {
            $.post(MY_CONSTANT.url + '/assign_new_artist',
                {
                    access_token: $cookieStore.get('obj').accesstoken,
                    booking_id: bookingId,
                    artist_id: artistId
                },
                function (data) {

                    data = JSON.parse(data);
                    $window.location.reload();

                });
            $scope.reloadRoute();
            return true;

        } else {
            $scope.selectedArtistId = 'default';
            return false;
        }
    };

    $scope.cancelSession = function (bookingId) {
        var retVal = confirm("Do you want to cancel this booking?");
        if (retVal == true) {
            $.post(MY_CONSTANT.url + '/admin_cancel_booking',
                {
                    access_token: $cookieStore.get('obj').accesstoken,
                    booking_id: bookingId
                },
                function (data) {

                    data = JSON.parse(data);
                    $window.location.reload();

                });
            $scope.reloadRoute();
            return true;

        } else {
            $scope.selectedArtistId = 'default';
            return false;
        }
    };

});