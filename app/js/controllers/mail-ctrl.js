App.controller('MailController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.email = {};
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };
    $scope.insert_template = function() {
        $scope.tags = $scope.email.template.email_variable;
        $scope.mail = $scope.email.template.template_html;
    };
    $scope.insert_tag = function(){
        CKEDITOR.instances.ck_editor.insertText($scope.email.tag);
    };
    
    // Get templates and tags.
    $.post(MY_CONSTANT.url + '/email_templates', {
       access_token: $cookieStore.get('obj').accesstoken 
    }, function (data) {
        $scope.$apply(function() {
            $scope.templates = data;
        });
    });
    
    $scope.editMailContent = function () {
        $.post(MY_CONSTANT.url + '/edit_email_templates', {
            access_token: $cookieStore.get('obj').accesstoken,
            template_name: $scope.email.template.template_name,
            template_html: $scope.mail,
            template_subject: $scope.email.template.template_subject
        }, function (data) {
            if (data.status) {
                ngDialog.open({
                    template: '<p>E-mail successfully updated !</p>',
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
            else {
                ngDialog.open({
                    template: '<p>Something went wrong!</p>',
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
});