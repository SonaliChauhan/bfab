App.controller('OngoingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
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

    var putData = function(column, dataArray, index) {
        var d = {
                    index:"",
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
                    notes:"",
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
                d.notes=column.notes;
                d.status = column.status;
                d.service_name = column.service_name;
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
    $scope.getServiceList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/ongoing_booking_paging', {
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


    $scope.getServiceList($scope.page_no);

// ****Search in  list***//
    var getService = function() {
        $.post(MY_CONSTANT.url + '/ongoing_booking', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
    getService();

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
            $scope.getServiceList(1);
        }
    };
    // Search for data
    $scope.$watch('search', function(value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        if(!completeList.length)
            getService();
        else {
            completeList.forEach(function(column) {
                var found = column.category.toLowerCase().search(value)>-1 || column.service_name.toLowerCase().search(value)>-1;
                found = found || column.address.toLowerCase().search(value)>-1 || column.cost.search(value)>-1;
                found = found || column.artist_name.search(value)>-1;
                if(found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });
//****************************//

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
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.index=0;
    $scope.city_techs = [];

    $scope.options = [10,25,50,100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];


    $scope.getTechList = function (booking_ids) {
        $scope.city_techs = [];
        $.post(MY_CONSTANT.url + '/assign_list', {
                booking_id: booking_ids
            },
            function (data) {
                data = JSON.parse(data);
                console.log(data);
                $scope.city_techs = data;
                console.log($scope.city_techs);
            });
    };

    var putData = function(column, dataArray, index) {
        var d = {
                    index:"",
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    service_date: "",
                    start_time: "",
                    category: "",
                    service_name: "",
                    customer_name: "",
                    artist_name: "",
                    notes:"",
                    address: "",
                    status: "",
                    cost: "",
                    change_address:"",
                    rating:"",
                    artist_id:"",
                    assigned_to:""
                };

                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    hours12 = startTimeHours % 12;
                var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;
                d.index=index;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.artist_id=column.artist_id;
                d.technician_id = column.technician_id;
                d.service_date = column.service_date;
                d.start_time = displayTime;
                d.category = column.category;
                d.service_name = column.service_name;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.notes=column.notes;
                d.address = column.address;
                d.status = column.status;
                d.cost = column.cost;
                d.change_address=column.change_address;
                d.rating=column.rating;
                d.assigned_to = column.assigned_to;
                d.city_techs = column.city_techs;
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
    $scope.getServiceList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/upcoming_booking_paging', {
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
    $scope.getServiceList($scope.page_no);

    // ****Search in customer list***//
    var getService = function() {
        $.post(MY_CONSTANT.url + '/upcoming_booking', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
        getService();
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
            $scope.getServiceList(1);
        }
    };
// Search for data
    $scope.$watch('search', function(value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        if(!completeList.length)
            getService();
        else {
            completeList.forEach(function(column) {
                var found = column.customer_name.toLowerCase().search(value) > -1 || column.service_name.toLowerCase().search(value) > -1;
                found = found || column.address.toLowerCase().search(value) > -1 || column.status.toLowerCase().search(value) > -1;
                found = found || column.category.toLowerCase().search(value) > -1 || column.cost.search(value) > -1;
                if(found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });
//****************************//
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
                ngDialog.close();
                data = JSON.parse(data);
                if (data.error) {
                    ngDialog.open({
                        template: '<p>' + data.error + '</p>',
                        className: 'ngdialog-theme-default',
                        plain: true
                    });
                    return false;
                }
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

App.controller('PastSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window,convertdatetime,getCategories) {
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

    var putData = function(column, dataArray, index) {
        var d = {
                    index:"",
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    notes:"",
                    address: "",
                    customer_name: "",
                    artist_name: "",
                    service_date: "",
                    start_time: "",
                    end_time: "",
                    actual_start_time: "",
                    actual_end_time: "",
                    status:"",
                    cost: "",
                    rating: "",
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
                d.index=index;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = startdisplayTime;
                d.end_time = enddisplayTime;
                d.status=column.status;
                d.actual_start_time = actualStartdisplayTime;
                d.actual_end_time = actualEnddisplayTime;
                d.cost = column.cost;
                d.notes=column.notes;
                d.category = column.category;
                d.service_date = date;
                d.rating = column.rating;
                d.service_name = column.service_name;
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

    $scope.getServiceList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/past_booking_paging', {
            access_token: $cookieStore.get('obj').accesstoken,
            page_no: page_number,
            length: $scope.page_length
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
            $scope.total_pages = Math.ceil(data.count/$scope.page_length);
            data.data.forEach(function (column) {
                putData(column, dataArray, ++index);
            });

            $scope.$apply(function () {
                $scope.list = dataArray;
                $scope.loading = false;
                if($scope.total_pages>7) {
                    if($scope.page_no == 1) {
                        start = 2;
                        end = $scope.total_pages>6?5:$scope.total_pages;
                    }
                    else {
                        if($scope.page_no!=$scope.last_page) {
                            if($scope.last_page < $scope.page_no) {
                                start = $scope.page_no - 1;
                                end = $scope.page_no + 2;
                            }
                            else {
                                start = $scope.page_no - 2;
                                end = $scope.page_no +1;
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
    $scope.getServiceList($scope.page_no);
    // ****Search in customer list***//
    var getService = function() {
        $.post(MY_CONSTANT.url + '/past_booking', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
    getService();

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
            $scope.getServiceList(1);
        }
    };
    // Search for data
    $scope.$watch('search', function(value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0, found_id = 0;
        value=value.toLowerCase();
        if(!completeList.length)
            getService();
        else {
            completeList.forEach(function(column) {
                var service_type = getCategories.getListFormat(column.category);
                var start_time = convertdatetime.convertTime(column.start_time);
                var end_time = convertdatetime.convertTime(column.end_time);
                var found = column.booking_id==value;
                if(found) {
                    index = 0;
                    found_id = 1;
                    searchArray = [];
                    putData(column, searchArray, ++index);
                }
                else if(!found_id){
                    found = column.customer_name.toLowerCase().search(value)>-1;
                    found = found || column.address.toLowerCase().search(value)>-1;
                    found = found || column.service_date.toLowerCase().search(value)>-1 || column.artist_name.toLowerCase().search(value)>-1;
                    found = found || column.service_name.toLowerCase().search(value)>-1 || service_type.toLowerCase().search(value)>-1;
                    found = found || start_time.toLowerCase().search(value)>-1 || end_time.toLowerCase().search(value)>-1;
                    if(found)
                        putData(column, searchArray, ++index);
                }
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }

    });
    //****************************//
});






App.controller('RejectedSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog,convertdatetime, getCategories) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.index = 0;

    $scope.options = [10, 25, 50, 100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function (column, dataArray, index) {
        var d = {
            index: "",
            id: "",
            booking_id: "",
            service_id: "",
            technician_id: "",
            address: "",
            customer_email: "",
            customer_phone: "",
            category: "",
            service_name: "",
            customer_name: "",
            artist_name: "",
            service_location: "",
            cost: "",
            notes: "",
            service_date: "",
            start_time: "",
            end_time: "",
            cancelation_time: ""
        };

        var date = column.service_date.toString().split("T")[0];
        d.index = index;
        d.id = column.id;
        d.booking_id = column.booking_id;
        d.category = column.category;
        d.sevice_name = column.sevice_name;
        d.customer_name = column.customer_name;
        d.customer_email = column.customer_email;
        d.customer_phone = column.customer_phone;
        d.artist_name = column.artist_name;
        d.address = column.address;
        d.cost = column.cost;
        d.notes = column.notes;
        d.start_time = convertdatetime.convertTime(column.start_time);
        d.end_time = convertdatetime.convertTime(column.end_time);
        d.categories = getCategories.getListFormat(column.category);
        d.service_date = date;
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

    $scope.getServiceList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/cancelled_bookings_paging', {
            access_token: $cookieStore.get('obj').accesstoken,
            page_no: page_number,
            length: $scope.page_length
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

    $scope.getServiceList($scope.page_no);

    // ****Search in customer list***//
    var getService = function () {
        $.post(MY_CONSTANT.url + '/upcoming_rejected_booking', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
    getService();

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
            $scope.getServiceList(1);
        }
    };
    // Search for data
    $scope.$watch('search', function (value) {
        console.log(value);
        $scope.page_no = 1;
        searchArray = [];
        var index = 0, found_id = 0;
        if (!completeList.length){
            getService();
            console.log("if");
        }
        else {
            console.log("else");
            var service_type = getCategories.getListFormat(column.category);
            var start_time = convertdatetime.convertTime(column.start_time);
            var end_time = convertdatetime.convertTime(column.end_time);
            var found = column.booking_id == value;
            if (found) {
                index = 0;
                found_id = 1;
                searchArray = [];
                putData(column, searchArray, ++index);
            }
            else if (!found_id) {
                found = column.customer_name.toLowerCase().search(value) > -1;
                found = found || column.address.toLowerCase().search(value) > -1 || column.cost <= value;
                found = found || column.service_date.toLowerCase().search(value) > -1 || column.artist_name.toLowerCase().search(value) > -1;
                found = found || column.service_name.toLowerCase().search(value) > -1 || service_type.toLowerCaase().search(value) > -1;
                found = found || start_time.toLowerCase().search(value) > -1 || end_time.toLowerCase().search(value) > -1;
                if (found)
                    putData(column, searchArray, ++index);
            }
        }
        $scope.searchResults(0, $scope.page_length, $scope.page_no);
    });
});
