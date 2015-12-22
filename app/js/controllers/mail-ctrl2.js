//'check_trail_period',
App.controller('NotificationController', ['$scope', '$http', '$cookies', '$cookieStore', '$state', 'ngDialog', '$timeout', '$interval', '$rootScope', 'MY_CONSTANT',
    function ($scope, $http, $cookies, $cookieStore, $state, ngDialog, $timeout, $interval, $rootScope, server_url) {//,check_trail_period) {

        'use strict';

//        $timeout(function () {
//            check_trail_period.data();
//        }, 500);

        $scope.alltags = [];
        $scope.allkeys = [];
        $scope.SMSBox = true;
        $scope.showloader = 1;

        var today = new Date();
        var finalMonth = parseInt(today.getMonth() + 1);
        var finalDate = today.getDate();
        var finalYear = today.getFullYear();

        var finalHours = today.getHours();
        var finalMins = today.getMinutes();
        var finalSeconds = today.getSeconds();
        if (finalHours < 10) {
            finalHours = "0" + finalHours;
        }
        if (finalMins < 10) {
            finalMins = "0" + finalMins;
        }
        if (finalSeconds < 10) {
            finalSeconds = "0" + finalSeconds;
        }
        var date = finalYear + "/" + finalMonth + "/" + finalDate
        var time = finalHours + ":" + finalMins + ":" + finalSeconds



        if ($cookieStore.get('orgNameObj')) {
            $scope.workflow = $cookieStore.get('orgNameObj').workflow;
        }

        /*
         Edit Notification Dialog
          */
        $scope.addNewNotificationDialog = function (name, emailText, smsmessage, subject,smsEnabled,emailEnabled, layout) {

            $.post(server_url + '/view_template_variables', {
                access_token: $cookieStore.get('obj').accesstoken,
                template_key: name,
                layout_type:layout
            }, function (data) {
                data = JSON.parse(data);
                $scope.$apply(function () {
                    var alltags = data.data.allowed_variables;
                    $scope.alltags = alltags.filter(function (itm, i, a) {
                        return i == a.indexOf(itm);
                    });

                });
            });

            $scope.value = true;
            $scope.addNotification = {};

            $scope.addNotification.name = name;
            $scope.addNotification.type = (smsEnabled==1 ? true : false);
            $scope.addNotification.type1 = (emailEnabled==1 ? true : false);
            $scope.addNotification.smsmessage = smsmessage;
            $scope.addNotification.emailmessage = emailText;
            $scope.addNotification.preview = smsmessage;
            $scope.addNotification.preview1 = emailText;
            $scope.addNotification.subject = subject;
            $scope.addNotification.layout = layout;

            ngDialog.open({
                template: 'addNotificationDialogId',
                className: 'ngdialog-theme-default notification',
                scope: $scope
            });

            $timeout(function(){
                if(smsEnabled && emailEnabled){
                     angular.element("#smsPanel").removeClass('disabledPanel');
                     angular.element("#emailPanel").removeClass('disabledPanel');

                     angular.element("#smsmessge").removeAttr('disabled');
                     angular.element("#emailmessagediv").prop('contenteditable','true');

                     angular.element("#smsSelect,#emailSelect,#subject").removeAttr('disabled');
                }
                else if(!smsEnabled && emailEnabled){
                    angular.element("#smsPanel").addClass('disabledPanel');
                    angular.element("#emailPanel").removeClass('disabledPanel');

                    angular.element("#smsmessge").attr('disabled','disabled');
                    angular.element("#emailmessagediv").prop('contenteditable','true');

                    angular.element("#smsSelect").attr('disabled','disabled');
                    angular.element("#emailSelect,#subject").removeAttr('disabled');
                }

                else if(smsEnabled && !emailEnabled){
                    angular.element("#smsPanel").removeClass('disabledPanel');
                    angular.element("#emailPanel").addClass('disabledPanel');

                    angular.element("#smsmessge").removeAttr('disabled');
                    angular.element("#emailmessagediv").prop('contenteditable','false');

                    angular.element("#smsSelect").removeAttr('disabled');
                    angular.element("#emailSelect,#subject").attr('disabled','disabled');
                }

                else if(!smsEnabled && !emailEnabled){
                    angular.element("#smsPanel").addClass('disabledPanel');
                    angular.element("#emailPanel").addClass('disabledPanel');

                    angular.element("#smsmessge").attr('disabled','disabled');
                    angular.element("#emailmessagediv").prop('contenteditable','false');
                    angular.element("#smsSelect,#emailSelect,#subject").attr('disabled','disabled');
                }

                try{
                    if(CKEDITOR) {
                        CKEDITOR.replace('emailmessagediv', {
                            //"filebrowserImageUploadUrl": "app/img/imgupload.php",
                            startupFocus : true
                        });

                    }
                }catch(err){
                    console.log(err);
                }
            },100)
        };

        /*
        Preview Email template
         */

        $scope.previewEmail = function(){
            try{
                if(CKEDITOR) {
                    var editor = CKEDITOR.instances['emailmessagediv'];
                    editor.execCommand('preview');
                }
            }catch(err){
                console.log(err);
            }
        }

        /*
        Filter Notification tags based on workflow
         */

        $scope.filterLayout = function(allkeys, layout_type){
            var array = [];
            angular.forEach(allkeys, function(value){
                if(value.layout_type == layout_type){
                    array.push(value);
                }
            });
            return array;
        }

        /*
        Get notification tags for all wokflow
         */

        $scope.getAllKeys = function () {
            $.post(server_url + '/view_template', {
                access_token: $cookieStore.get('obj').accesstoken
            }, function (data) {
                data = JSON.parse(data);
                $scope.$apply(function () {
                    $scope.allkeys = data.data;
                    $scope.showloader = 0;
                });
            });
        }

        $scope.getAllKeys();


        $scope.items = [];

        /*
        Insert Message Tag From dropdown to message template
         */

        $scope.insertMessageTag = function () {
            var selectedTag = $scope.addNotification.select1;
            $scope.items.push(selectedTag);
            $rootScope.$broadcast('insertMessageTag', selectedTag);
            $scope.addNotification.smsmessage = $("#smsmessge").val();
        };

        /*
         Insert Email Tag From dropdown to email template
         */

        $scope.insertMessageTag2 = function () {
            $("#emailmessagediv").attr("tabindex",-1).focus();
            var selectedTag = $scope.addNotification.select2;
            if(CKEDITOR) {
                CKEDITOR.instances.emailmessagediv.insertText(selectedTag);
            }
            //var sel, range;
            //if (window.getSelection) {
            //    // IE9 and non-IE
            //    sel = window.getSelection();
            //    if (sel.getRangeAt && sel.rangeCount) {
            //        range = sel.getRangeAt(0);
            //        range.deleteContents();
            //
            //        // Range.createContextualFragment() would be useful here but is
            //        // non-standard and not supported in all browsers (IE9, for one)
            //        var el = document.createElement("div");
            //        el.innerHTML = selectedTag;
            //        var frag = document.createDocumentFragment(), node, lastNode;
            //        while ((node = el.firstChild)) {
            //            lastNode = frag.appendChild(node);
            //        }
            //        range.insertNode(frag);
            //
            //        // Preserve the selection
            //        if (lastNode) {
            //            range = range.cloneRange();
            //            range.setStartAfter(lastNode);
            //            range.collapse(true);
            //            sel.removeAllRanges();
            //            sel.addRange(range);
            //        }
            //    }
            //} else if (document.selection && document.selection.type != "Control") {
            //    // IE < 9
            //    document.selection.createRange().pasteHTML(selectedTag);
            //}

        };


        $scope.$watch('addNotification.smsmessage', function (newValue, oldValue) {
            if (newValue != undefined) {
                $scope.addNotification.preview = ((((((newValue).replace(/\[CustomerName]/g, "John")).replace(/\[Date]/g, date)).replace(/\[Time]/g, time)).replace(/\[DriverName]/g, "Rob")).replace(/\[TrackingLink]/g, "tookanapp.com")).replace(/\[OrgName]/g, "Tookan");

            }

        });
        

       /*
       Updating new templates
        */

        $scope.addNewNotification = function () {
            var sms_notify=$scope.addNotification.type ? ($scope.addNotification.type==true? 1 : 0) : 0;
            var email_notify=$scope.addNotification.type1 ? ($scope.addNotification.type1==true? 1 : 0) : 0;
            $.post(server_url + '/enable_or_disable_notification', {
                access_token: $cookieStore.get('obj').accesstoken,
                template_key: $scope.addNotification.name,
                status: email_notify,
                sms_status:sms_notify,
                layout_type:$scope.addNotification.layout
            }, function (data) {
                data = JSON.parse(data);
                $scope.$apply();
                // scrollTo(0, 0);
            });

            $.post(server_url + '/insert_template_text', {
                access_token: $cookieStore.get('obj').accesstoken,
                template_key: $scope.addNotification.name,
                email_text: (CKEDITOR && CKEDITOR.instances && CKEDITOR.instances.emailmessagediv) ? CKEDITOR.instances.emailmessagediv.getData() : $scope.addNotification.emailmessage,
                email_subject: $scope.addNotification.subject,
                sms_text: $scope.addNotification.smsmessage,
                layout_type:$scope.addNotification.layout
            }, function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    //$scope.successMsg = data.message.toString();
                    $rootScope.successMessageGlobal = data.message.toString();
                    $scope.addNotification = {};
                    $timeout(function () {
                        //$scope.successMsg = false;
                        $rootScope.successMessageGlobal = false;
                        $scope.getAllKeys();
                    }, 1000)
                } else {
                    //$scope.errorMsg = data.message.toString();
                    $rootScope.errorMessageGlobal = data.message.toString();
                    $timeout(function () {
                        //$scope.errorMsg = false;
                        $rootScope.errorMessageGlobal = false;
                    }, 1000)
                }
                ngDialog.close({
                    template: 'addNotificationDialogId',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });

                $scope.$apply();
                // scrollTo(0, 0);
            });
        };

        /*
        Enable or disable editing of sms or email template
         */
        $scope.setNotificationOptions = function (key) {
            var sms_notify=$scope.addNotification.type ? ($scope.addNotification.type==true? 1 : 0) : 0;
            var email_notify=$scope.addNotification.type1 ? ($scope.addNotification.type1==true? 1 : 0) : 0;
            if(sms_notify && email_notify){
                angular.element("#smsPanel").removeClass('disabledPanel');
                angular.element("#emailPanel").removeClass('disabledPanel');

                angular.element("#smsmessge").prop('disabled',false);
                angular.element("#emailmessagediv").prop('contenteditable','true');

                angular.element("#smsSelect,#emailSelect,#subject").prop('disabled',false);
            }else if(!sms_notify && email_notify){
                angular.element("#smsPanel").addClass('disabledPanel');
                angular.element("#emailPanel").removeClass('disabledPanel');

                angular.element("#smsmessge").attr('disabled','disabled');
                angular.element("#emailmessagediv").prop('contenteditable','true');

                angular.element("#smsSelect").attr('disabled','disabled');
                angular.element("#emailSelect,#subject").prop('disabled',false);
            }else if(sms_notify && !email_notify){
                angular.element("#smsPanel").removeClass('disabledPanel');
                angular.element("#emailPanel").addClass('disabledPanel');

                angular.element("#smsmessge").prop('disabled',false);
                angular.element("#emailmessagediv").prop('contenteditable','false');

                angular.element("#smsSelect").prop('disabled',false);
                angular.element("#emailSelect,#subject").attr('disabled','disabled');
            }else if(!sms_notify && !email_notify){
                angular.element("#smsPanel").addClass('disabledPanel');
                angular.element("#emailPanel").addClass('disabledPanel');

                angular.element("#smsmessge").attr('disabled','disabled');
                angular.element("#emailmessagediv").prop('contenteditable','false');
                angular.element("#smsSelect,#emailSelect,#subject").attr('disabled','disabled');
            }
        }


        $scope.setFocus = function (key) {
            $('#emailmessagediv').focus();
            $scope.setNotificationOptions(key);
        }

        /*
        Enable or disable different tags
         */
        $scope.actionsForSMSAndEmail=function(sms_notify,email_notify,key, layout){
            $.post(server_url + '/enable_or_disable_notification', {
                access_token: $cookieStore.get('obj').accesstoken,
                template_key: key,
                status: email_notify,
                sms_status:sms_notify,
                layout_type:layout
            }, function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    $scope.getAllKeys();
                } else {
                    $rootScope.errorMessageGlobal = data.message.toString();
                    $timeout(function () {
                        $rootScope.errorMessageGlobal = false;
                    }, 1000)
                }
                $scope.$apply();
            });
        }



    }]);