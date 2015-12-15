App.controller('CustomersController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window) {
    'use strict';
    $scope.loading = true;

    var getCustomerList = function () {
        $.post(MY_CONSTANT.url + '/customer_list', {
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
                    cust_id: "",
                    name: "",
                    phone_no: "",
                    email: "",
                    reg_date: "",
                    is_block: ""
                };

                d.cust_id = column.user_id;
                d.name = column.first_name + " " + column.last_name;
                d.phone_no = column.mobile;
                d.email = column.email;
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

    $scope.deleteCustomer = function (userid) {

        //console.log(userid);


        var retVal = confirm("Do you want to delete ?");
        if (retVal == true) {
            $.post(MY_CONSTANT.url + '/delete_user',
                {
                    access_token: $cookieStore.get('obj').accesstoken,
                    user_id: userid
                }
                ,

                function (data) {

                    $window.location.reload();


                });
            return true;

        } else {

            return false;
        }

    };

    $scope.changeStatus = function (status, userId) {
        //console.log(status);
        //console.log(userId);
        var confirmMsg = "";
        if (status == 1)
            confirmMsg = "Are you sure you want to block this user?";
        else
            confirmMsg = "Are you sure you want to unblock this user?";
        var retVal = confirm(confirmMsg);
        if (retVal == true) {
            $.post(MY_CONSTANT.url + '/block_unblock_user',
                {


                    access_token: $cookieStore.get('obj').accesstoken,
                    user_id: userId,
                    new_block_status: status
                }
                ,

                function (data) {
                    console.log(data);
                    $window.location.reload();

                });
        }
        else {
            return false;
        }
    };


});