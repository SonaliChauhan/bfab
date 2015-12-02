App.controller('FeedbackUserController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getFeedbackList = function () {
        $.post(MY_CONSTANT.url + '/show_feedback', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            //console.log(data);
            data = data.user_feedback;
            data.forEach(function (column) {

                var d = {
                    feedback_id: "",
                    user_status: "",
                    user_name: "",
                    email: "",
                    mobile: "",
                    feedback: "",
                    feedback_datetime: ""
                };

                var date = column.feedback_datetime.toString().split("T")[0];
                d.feedback_id = column.id;
                d.user_status = 1;
                d.user_name = column.name;
                d.email = column.email;
                d.mobile = column.mobile;
                d.feedback = column.feedback_text;
                d.feedback_datetime = date;
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

    getFeedbackList();

    // Delete Dialog
    $scope.deleteFeedback = function (feedbackId, userStatus) {
        $scope.feedback_id = feedbackId;
        $scope.feedback_by = userStatus;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_feedback',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                feedback_id: $scope.feedback_id,
                feedback_by: parseInt($scope.feedback_by)
            },
            function (data) {
                $window.location.reload();

            });

    };


});

App.controller('FeedbackSPController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getFeedbackList = function () {
        $.post(MY_CONSTANT.url + '/show_feedback', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            //console.log(data);
            data = data.tech_feedback;
            data.forEach(function (column) {

                var d = {
                    feedback_id: "",
                    user_status: "",
                    user_name: "",
                    email: "",
                    mobile: "",
                    feedback: "",
                    feedback_datetime: ""
                };

                var date = column.feedback_datetime.toString().split("T")[0];
                d.feedback_id = column.id;
                d.user_status = 2;
                d.user_name = column.name;
                d.email = column.email;
                d.mobile = column.mobile;
                d.feedback = column.feedback_text;
                d.feedback_datetime = date;
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

    getFeedbackList();

    // Delete Dialog
    $scope.deleteFeedback = function (feedbackId, userStatus) {
        $scope.feedback_id = feedbackId;
        $scope.feedback_by = userStatus;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_feedback',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                feedback_id: $scope.feedback_id,
                feedback_by: parseInt($scope.feedback_by)
            },
            function (data) {
                $window.location.reload();

            });

    };


});