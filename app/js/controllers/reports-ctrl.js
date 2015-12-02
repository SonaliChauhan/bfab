App.controller('ReportsController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, convertdatetime, ngDialog) {
    $scope.add = {};
    $scope.add.report_type = "1";
    $scope.getReport = function () {
        if (!$scope.add.from_date) {
            ngDialog.open({
                template: '<p class="del-dialog">Please select start date first !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        else if (!$scope.add.to_date) {
            ngDialog.open({
                template: '<p class="del-dialog">Please select end date first !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        if ($scope.add.to_date < $scope.add.from_date) {
            ngDialog.open({
                template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }

        var from_date = convertdatetime.convertDate($scope.add.from_date);
        var to_date = convertdatetime.convertDate($scope.add.to_date);
        $.post(MY_CONSTANT.url + '/download_report',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                report_of: $scope.add.report_type,
                date_from: from_date,
                date_to: to_date
            }
            ,
            function (data) {
                JSONToCSVConvertor(data, "Report", true);
            });
        return true;

    };

    $scope.checkDate = function () {
        if ($scope.add.to_date < $scope.add.from_date) {
            ngDialog.open({
                template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
    }

    var JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "Vizavoo_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

});


