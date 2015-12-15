App.controller('VerifiedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.total_records;

    $scope.options = [10,25,50,100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function(column, dataArray, index){
        var d = {
            artist_id: "",
            name: "",
            phone_no: "",
            email: "",
            qualification: "",
            experience: "",
            rating: "",
            category: "",
            reg_date: "",
            city: "",
            summary:"",
            is_block: "",
            is_edited:""
        };
        d.artist_id = column.user_id;
        d.name = column.first_name + " " + column.last_name;
        d.phone_no = column.mobile;
        d.email = column.email;
        d.qualification = column.qualification;
        d.experience = column.experience;
        d.gender = column.gender;
        d.summary = column.summary;
        if (column.rating == "" || column.rating == null) {
            d.rating = 0;
        }
        else {
            d.rating = column.rating;
        }
        if (column.technician_type == 1) {
            d.category = MY_CONSTANT.HAIR;
        }
        else if (column.technician_type == 2) {
            d.category = MY_CONSTANT.MAKEUP;
        }
        else {
            d.category = MY_CONSTANT.HAIRMAKEUP;
        }
        d.reg_date = column.registration_datetime.toString().split("T")[0];
        d.city = column.city;
        d.is_block = column.is_block;
        d.isEdited = column.isEdited;
        dataArray.push(d);
        console.log(data);

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
    $scope.getArtistList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        var index = (page_number - 1) * $scope.page_length;
        $.post(MY_CONSTANT.url + '/verified_artists_paging', {
            access_token: $cookieStore.get('obj').accesstoken,
            page_no: page_number,
            length: $scope.page_length
        },function (data) {
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
    $scope.getArtistList($scope.page_no);

    // ****Search in customer list***//,
    var getArtist = function() {
        $.post(MY_CONSTANT.url + '/verified_artists' ,{
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            completeList = data;
        });
    };
    getArtist();

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
            $scope.getArtistList(1);
        }
    };
    // Search for data
    $scope.$watch('search', function(value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        if(!completeList.length)
            getArtist();
        else {
            completeList.forEach(function(column) {
                var found = column._id.toLowerCase().search(value)>-1 || column.orderCreatedTime.search(value)>-1;
                found = found || column.pickUpLocationName.toLowerCase().search(value)>-1;
                if(found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });
    // Delete Dialog
    $scope.deleteArtist = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_artist',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };
    // Edit Dialog
    $scope.editArtistCall = function (json) {
        $scope.json = json;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-artist-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        })

        $scope.options_exp = [{
            name: '0-1 years',
            value: '0-1 years'
        }, {
            name: '1-3 years',
            value: '1-3 years'
        }, {
            name: '3-7 years',
            value: '3-7 years'
        }, {
            name: '7 above',
            value: '7 above'
        }];

        $scope.options_cat = [{
            name: 'Hair',
            value: '1'
        }, {
            name: 'Make-up',
            value: '2'
        }, {
            name: 'Both',
            value: '3'
        }];
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

        $.post(MY_CONSTANT.url + '/block_unblock_artist',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.user_val,
                new_block_status: $scope.status
            },
            function (data) {
                $window.location.reload();

            });
    };

});

App.controller('NewRequestedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getArtistList = function () {
        $.post(MY_CONSTANT.url + '/new_requests', {
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
                    artist_id: "",
                    name: "",
                    phone_no: "",
                    email: "",
                    qualification: "",
                    experience: "",
                    gender: "",
                    summary: "",
                    reg_date: "",
                    city: "",
                    is_block: ""
                };

                d.artist_id = column.user_id;
                d.name = column.first_name + " " + column.last_name;
                d.phone_no = column.mobile;
                d.email = column.email;
                d.qualification = column.qualification;
                d.experience = column.experience;
                d.gender = column.gender;
                d.summary = column.summary;
                d.reg_date = column.registration_datetime.toString().split("T")[0];
                d.city = column.city;
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

    getArtistList();

    $scope.doVerify = function (userId) {

        $.post(MY_CONSTANT.url + '/verify_new_artist', {


                access_token: $cookieStore.get('obj').accesstoken,
                user_id: userId
            },

            function (data) {

                //console.log(data);
                $window.location.reload();

            });


    };

    // Delete Dialog
    $scope.deleteArtist = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_artist',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('ArtistInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $stateParams) {
    'use strict';
    $scope.loading = true;
    $scope.loading_image = true;
    $scope.artist = {};
    var userId = $stateParams.id;
    $.post(MY_CONSTANT.url + '/artist_details', {
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

        var artist_data = data.artist_detail[0];

        $scope.artist.image = artist_data.image_url;
        $scope.artist.name = artist_data.name;
        $scope.artist.email = artist_data.email;
        $scope.artist.phone = artist_data.mobile;
        $scope.loading_image = false;

        data = data.services;
        data.forEach(function (column) {

            var d = {
                id: "",
                service_name: "",
                service_date: "",
                address: "",
                start_time: "",
                end_time: "",
                cost: "",
                customer_name: "",
                status: "",
                rating: ""
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

            d.service_name = column.service_name;
            d.service_date = column.date;
            d.address = column.address;
            d.start_time = startDisplayTime;
            d.end_time = endDisplayTime;
            d.cost = column.cost;
            d.customer_name = column.customer_name;
            d.status = column.status;
            d.rating = column.rating;
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
