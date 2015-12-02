App.controller('LocationController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, convertdatetime, $window, ngDialog) {

    var getLocation = function () {
        $.post(MY_CONSTANT.url + '/all_city', {   
            access_token: $cookieStore.get('obj').accesstoken
        }, function (data) {
            var dataArray = [];
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
            data.forEach(function (column) {

                var d = {
                    pin_code: "",
                    city: "",
                };

                d.pin_code = column.pincode;
                d.city = column.name;
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

    getLocation();

    $scope.location = {};
    
    $scope.addLocation = function () {

        if ($scope.location.pin_code == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please fill the pin code !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;

        }
        else if ($scope.location.city == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please enter city !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }

        $.post(MY_CONSTANT.url + '/add_city',   
            {
                access_token: $cookieStore.get('obj').accesstoken,
                pincode:$scope.location.pin_code,
                name: $scope.location.city,
            },
            function (data) {
                console.log(data);
                if (data.status == 'true') {
                    $window.location.reload();
                }
                else {
                    ngDialog.open({
                        template: '<p class="del-dialog">' + data.error + '</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'

                    });
                }
            });


    };

    // Delete Dialog
    $scope.deleteLocation = function (pin) {
        $scope.dele_val = pin;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_city',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                pincode: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});
