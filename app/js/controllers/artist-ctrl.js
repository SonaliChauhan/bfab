App.controller('VerifiedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getArtistList = function () {
        $.post(MY_CONSTANT.url + '/verified_artists', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            //console.log(data);
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
                    rating: "",
                    category: "",
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
                console.log(data);
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
            d.customer_name = column.customer_name;
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