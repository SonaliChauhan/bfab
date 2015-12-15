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
//console.log(column.id);
                var d = {
                    pin_code: "",
                    id:"",
                    city_name: ""
                };

                d.pin_code = column.pincode;
                d.id = column.id;
                d.city_name = column.city_name;
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
        else if ($scope.location.city_name == undefined) {
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
                name: $scope.location.city_name
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
    $scope.deleteLocation = function (id) {
        $scope.dele_val = id;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {
   // alert("ddd");
        $.post(MY_CONSTANT.url + '/delete_city',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                id: $scope.dele_val
            },
            function (data) {
               console.log(data);
                $window.location.reload();

            });

    };

});
