App.controller('FAQController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    /* Update faq Content */
    $scope.addAboutContent = function () {
        $.post(MY_CONSTANT.url + '/update_faq', {
            access_token: $cookieStore.get('obj').accesstoken,
            faq_1: $scope.faq
        }, function (data) {
            data = JSON.parse(data);
            if (data.log) {
                ngDialog.open({
                    template: '<p>FAQ successfully updated !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: false,
                    closeByDocument: true,
                    closeByEscape: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 2000);
            }

        });
    };

    /* Get Menu and Banner Content */
    $.post(MY_CONSTANT.url + '/show_faq', {
        access_token: $cookieStore.get('obj').accesstoken
    }, function (data) {
        data = JSON.parse(data);
        //console.log(data)
        $scope.$apply(function () {
            $scope.faq = data.faq[0].faq_1;
        });

    });
});