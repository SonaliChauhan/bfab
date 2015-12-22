App.controller('EditArtistController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, $timeout, $window) {
    'use strict';
    $scope.options_city = [];
    var catArr = $scope.json.category;
    var category = [
        {
            'name': 'Hair',
            'value': '1'
        },
        {
            'name':'Makeup',
            'value':'2'
        },
        {
            'name':'Both',
            'value':'3'
        }
    ];
        var getCitiesList = function (city) {
            $http({
                method: "post",
                url: MY_CONSTANT.url + '/all_city',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                data: $.param({access_token: $cookieStore.get('obj').accesstoken})
            }).success(function (data) {
                $scope.options_city = data;
                console.log($scope.options_city);
                //data.forEach(function(column) {
                    //if(city.match(column.name) || city.match(column.pincode)){
                    //    $scope.editArtist.city.push(column);
                    //}
                    //$scope.options_city.push(column);
                //});
                $scope.options_cat = category;
            });
        };
//        cat_param.id = column;
//        cat_param.name = column;
//        catArrFinal.push(cat_param);
//    });
//
    $scope.editArtist = {
        tech_id: $scope.json.artist_id,
        first_name: $scope.json.first_name,
        last_name: $scope.json.last_name,
        phone: $scope.json.phone_no,
        gender: $scope.json.gender,
        experience: $scope.json.experience,
        qualification: $scope.json.qualification,
        summary: $scope.json.summary
        //city: catArrFinal
        //category: $scope.json.category
    };
//    $scope.updateVal = $scope.json.category;
//    $scope.imgSrc = $scope.json.image;
//
//    //an array of files selected
//    $scope.files = [];
//
//    //listen for the file selected event
//    $scope.$on("fileSelected", function (event, args) {
//        $scope.$apply(function () {
//            //add the file object to the scope's files collection
//            $scope.files.push(args.file);
//        });
//    });
//
//    /* Get to be uploading file and set it into a variable and read to show it on view */
//    $scope.file_to_upload = function (File) {
//        $scope.FileUploaded = File[0];
//        //console.log(File[0]);
//
//        var file = File[0];
//        var imageType = /image.*/;
//        if (!file.type.match(imageType)) {
//
//        }
//        var img = document.getElementById("thumbnil");
//        img.file = file;
//        var reader = new FileReader();
//        reader.onload = (function (aImg) {
//            return function (e) {
//                aImg.src = e.target.result;
//            };
//        })(img);
//        reader.readAsDataURL(file);
//    };
//
//    /* Upload Doc files */
//    var doc1Arr = [];
//    var doc2Arr = [];
//    var doc3Arr = [];
//    $scope.doc_to_upload = function (File, type) {
//
//        if (type == 1) {
//            doc1Arr = [];
//            doc1Arr.push(File[0]);
//        }
//        if (type == 2) {
//            doc2Arr = [];
//            doc2Arr.push(File[0]);
//        }
//        if (type == 3) {
//            doc3Arr = [];
//            doc3Arr.push(File[0]);
//        }
//        $scope.doc_1_list = doc1Arr[0];
//        $scope.doc_2_list = doc2Arr[0];
//        $scope.doc_3_list = doc3Arr[0];
//
//        if ($scope.doc_1_list == undefined) {
//            $scope.doc_1_list = "";
//        }
//        if ($scope.doc_2_list == undefined) {
//            $scope.doc_2_list = "";
//        }
//        if ($scope.doc_3_list == undefined) {
//            $scope.doc_3_list = "";
//        }
//    };
//
//    var getCitiesList = function () {
//        $.post(MY_CONSTANT.url + '/get_service_area_codes',
//            {
//
//                access_token: $cookieStore.get('obj').accesstoken
//            },
//            function (data) {
//                data = JSON.parse(data);
//                data = data.service_cities;
//                $scope.$apply(function () {
//                    $scope.options_city = data;
//                });
//
//            });
//    };
//
//    getCitiesList();
//
//    $scope.successMsg = '';
//    $scope.errorMsg = '';
//    $scope.EditArtist = function () {
//        $scope.cityArr = [];
//        var city = $scope.editArtist.city;
//        city.forEach(function (column) {
//            $scope.cityArr.push(column.name);
//        });
//        $scope.city_val = $scope.cityArr.toString();
//        $scope.category_val = $scope.updateVal.toString();
//
//        var formData = new FormData();
//
//        formData.append("access_token", $cookieStore.get('obj').accesstoken);
//        formData.append("tech_id", $scope.editArtist.tech_id);
//        formData.append("first_name", $scope.editArtist.first_name);
//        formData.append("last_name", $scope.editArtist.last_name);
//        formData.append("mobile", $scope.editArtist.phone);
//        formData.append("city", $scope.city_val);
//        formData.append("city_flag", "1");
//        formData.append("experience", $scope.editArtist.experience);
//        formData.append("summary", $scope.editArtist.summary);
//        formData.append("gender", $scope.editArtist.gender);
//        formData.append("profile_pic", $scope.FileUploaded);
//        formData.append("qualifications", $scope.editArtist.qualification);
//        formData.append("tech_type", $scope.category_val);
//
//        $.ajax({
//            type: "POST",
//            url: MY_CONSTANT.url + '/edit_tech_profile',
//            dataType: "json",
//            data: formData,
//
//            async: false,
//            processData: false,
//            contentType: false,
//            success: function (data) {
//                //console.log(data);
//                if (data.error) {
//                    alert(data.error);
//                    ngDialog.open({
//                        template: '<p>' + data.error + '</p>',
//                        className: 'ngdialog-theme-default',
//                        plain: true,
//                        showClose: false,
//                        closeByDocument: true,
//                        closeByEscape: true
//                    });
//                } else {
//                    ngDialog.open({
//                        template: '<p>' + data.message + '</p>',
//                        className: 'ngdialog-theme-default',
//                        plain: true,
//                        showClose: false,
//                        closeByDocument: false,
//                        closeByEscape: false
//                    });
//                    $timeout($window.location.reload(), 1000);
//                }
//            }
//
//        });
//    }
//});
        $scope.editArtist = {
            tech_id: $scope.json.artist_id,
            first_name: $scope.json.first_name,
            last_name: $scope.json.last_name,
            phone: $scope.json.phone_no,
            gender: $scope.json.gender,
            categories: category,
            experience: $scope.json.experience,
            qualification: $scope.json.qualification,
            summary: $scope.json.summary,
            city: []

        };
        getCitiesList($scope.json.city);

        var str = $scope.editArtist.phone;
        $scope.editArtist.phone = str.replace(/[^0-9]+/ig, "");
        $scope.imgSrc = $scope.json.image;
        //an array of files selected
        $scope.files = [];

        //listen for the file selected event
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

        /* Get to be uploading file and set it into a variable and read to show it on view */
        $scope.file_to_upload = function (File) {
            $scope.FileUploaded = File[0];
            //console.log(File[0]);

            var file = File[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("thumbnil");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        };
        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.EditArtist = function () {

            $scope.city_val = '';
            $scope.editArtist.city.forEach(function(column) {
                $scope.city_val += ',' + column.name;
            });
            $scope.city_val = $scope.city_val.slice(1);

            $scope.category_val = getCategories.getCategoryListForEditArtist($scope.editArtist.categories);

            var str = $scope.editArtist.phone;
            var res1 = str.substring(0, 4);
            var res2 = str.substring(4,7);
            var res3 = str.substring(7,10);
            $scope.editArtist.phone = "" + res1 + "-" + res2 + "-" + res3;

            var formData = new FormData();
            formData.append("access_token", $cookieStore.get('obj').accesstoken);
            formData.append("tech_id", $scope.editArtist.tech_id);
            formData.append("first_name", $scope.editArtist.first_name);
            formData.append("last_name", $scope.editArtist.last_name);
            formData.append("mobile", $scope.editArtist.phone);
            formData.append("city", $scope.city_val);
            formData.append("gender",$scope.editArtist.gender);
            formData.append("qualification",$scope.editArtist.qualification);
            formData.append("experience",$scope.editArtist.experience);
//        formData.append("city", $scope.editArtist.city);
            formData.append("city_flag", "1");
            formData.append("profile_pic", $scope.FileUploaded);
            formData.append("tech_type", $scope.category_val);

            $.ajax({
                type: "POST",
                url: MY_CONSTANT.url + '/edit_tech_profile',
                dataType: "json",
                data: formData,
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if(data.error) {
                        ngDialog.open({
                            template: '<p>' + data.error + '</p>',
                            className: 'ngdialog-theme-default',
                            plain: true,
                            showClose: false,
                            closeByDocument: true,
                            closeByEscape: true
                        });
                    } else {
                        ngDialog.open({
                            template: '<p>' + data.message + '</p>',
                            className: 'ngdialog-theme-default',
                            plain: true,
                            showClose: false,
                            closeByDocument: false,
                            closeByEscape: false
                        });
                        $timeout($window.location.reload(), 3000);
                    }
                }

            });
        };
    });