App.controller('DriverDatabaseController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout) {
    'use strict';
    $scope.loading = true;
    var driver_details = function (flag) {
        $.post(MY_CONSTANT.url + '/driver_details', {
            access_token: $cookieStore.get('obj').accesstoken,
            flag: flag

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            console.log(data);
            data = data.driver_data;
            data.forEach(function (column) {

                var d = {
                    user_id: "",
                    user_name: "",
                    user_image: "",
                    user_email: "",
                    phone_no: "",
                    date_registered: "",
                    car_model: "",
                    car_maker: "",
                    is_verified: ""
                };

                d.user_id = column.user_id;
                d.user_name = column.user_name;
                d.user_image = column.user_image;
                d.user_email = column.user_email;
                d.phone_no = column.phone_no;
                var local_order_time = new Date((column.date_registered + ' UTC').replace(/-/g, "/"));
                var date_signedup = local_order_time.toString().replace(/GMT.*/g, "");
                d.date_registered = date_signedup;
                d.car_model = column.car_model;
                d.car_maker = column.car_maker;
                d.is_verified = column.driver_verified;
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
    }

    driver_details(2);

    $scope.approvalstatus = function (driverId, status) {
        $.post(MY_CONSTANT.url + '/verify_driver',
            {

                access_token: $cookieStore.get('obj').accesstoken,
                driver_id: driverId,
                status: status
            }
            ,

            function (data) {

                console.log(data);

                driver_details(2);

            });
    };

    $scope.deletedriver = function (index, orderId) {
        $.post(MY_CONSTANT.url + '/delete_driver',
            {

                access_token: $cookieStore.get('obj').accesstoken,
                id: orderId
            }
            ,

            function (data) {
                //data = JSON.parse(data);

                if (data.error) {
                    alert(data.error);
                } else {
                    $scope.list.splice(index, 1);
                    //driver_details(2);
                }

            });
    };


    $scope.changedValue = function (flag) {
        if (flag) {
            driver_details(flag);
        } else {
            driver_details(2);
        }
    }

});