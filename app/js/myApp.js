var myApp = angular.module('myAppName', ['angle', 'uiGmapgoogle-maps']);

myApp.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);
myApp.run(["$log", function ($log) {

    //$log.log('I\'m a line from custom.js');

}]);

App.constant("MY_CONSTANT", {
    "url": "http://devadmin.bfabmobile.com:2500",
    "HAIR": "Hair",
    "MAKEUP": "Make-up",
    "HAIRMAKEUP": "Both",
    "HAIRVALUE": "1",
    "MAKEUPVALUE": "2",
    "HAIRMAKEUPVALUE": "3"
});

App.constant("responseCode", {
    "SUCCESS": 200
});
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        //Stripe.setPublishableKey('pk_test_uwFTQNMZNR97NNkYRR9lfnKU');

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
        $urlRouterProvider.otherwise('/page/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html'
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull', 'whirl', 'ngDialog')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.scheduler', {
                url: '/scheduler',
                title: 'scheduler',
                templateUrl: helper.basepath('scheduler.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')

            })
            .state('app.customers', {
                url: '/customers',
                title: 'Customer Information',
                templateUrl: helper.basepath('customer_list.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.customerInfo', {
                url: "/customerinfo/{id:[0-9]*}",
                title: 'Customer Details',
                templateUrl: helper.basepath('customer-info.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.verified-artist', {
                url: '/verified-artist',
                title: 'Verified Artists',
                templateUrl: helper.basepath('verified_artist.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.artistInfo', {
                url: "/artistinfo/{id:[0-9]*}",
                title: 'Artist Details',
                templateUrl: helper.basepath('artist-info.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.requested-artist', {
                url: '/requested-artist',
                title: 'New Requested Artists',
                templateUrl: helper.basepath('new_requested_artist.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.add-session', {
                url: '/add-session',
                title: 'Add Session',
                templateUrl: helper.basepath('add_session.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.ongoing', {
                url: '/ongoing',
                title: 'Ongoing Session',
                templateUrl: helper.basepath('ongoing.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.upcoming', {
                url: '/upcoming',
                title: 'Upcoming Session',
                templateUrl: helper.basepath('upcoming.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.cancelled', {
                url: '/cancelled',
                title: 'cancelled Session',
                templateUrl: helper.basepath('cancelled.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.past', {
                url: '/past',
                title: 'Past Session',
                templateUrl: helper.basepath('past.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.service', {
                url: '/service',
                title: 'Services Information',
                templateUrl: helper.basepath('service.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngWig', 'parsley')
            })
            .state('app.driverdatabase', {
                url: '/driverdatabase',
                title: 'Driver Database',
                templateUrl: helper.basepath('driver_database.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.payment', {
                url: '/payment',
                title: 'Payment',
                templateUrl: helper.basepath('payment.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.paymentInfo', {
                url: "/{id:[0-9]*}",
                title: 'Payment Details',
                templateUrl: helper.basepath('payment-info.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.activepromo', {
                url: '/promo',
                title: 'Promo Codes',
                templateUrl: helper.basepath('active_promo.html'),
                resolve: helper.resolveFor('parsley', 'datatables', 'datatables-pugins')
            })

            .state('app.expiredpromo', {
                url: '/expiredpromo',
                title: 'Expired Promo',
                templateUrl: helper.basepath('expired_promo.html'),
                resolve: helper.resolveFor('parsley', 'datatables', 'datatables-pugins')
            })
            .state('app.location',{
                url:'/location',
                title:'Location',
                templateUrl: helper.basepath('location.html'),
                resolve: helper.resolveFor('parsley', 'datatables', 'datatables-pugins')
            })
            .state('app.feedback', {
                url: '/feedback',
                title: 'Feedback',
                templateUrl: helper.basepath('feedback.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.artistfeedback', {
                url: '/artistfeedback',
                title: 'Artist Feedback',
                templateUrl: helper.basepath('artist_feedback.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.reports', {
                url: '/reports',
                title: 'Reports',
                templateUrl: helper.basepath('reports.html')
            });

        //
        // CUSTOM RESOLVES
        //   Add your own resolves properties
        //   following this object extend
        //   method
        // -----------------------------------
        // .state('app.someroute', {
        //   url: '/some_url',
        //   templateUrl: 'path_to_template.html',
        //   controller: 'someController',
        //   resolve: angular.extend(
        //     helper.resolveFor(), {
        //     // YOUR RESOLVES GO HERE
        //     }
        //   )
        // })

        /**=========================================================
         * Conversion of Date & Time Format common factory
         =========================================================*/
        App.factory('convertdatetime', function () {
            return {

                convertDate: function (DateTime) {
                    var _utc = new Date(DateTime);
                    if (_utc.getUTCMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getUTCMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getUTCMonth()) + 1;
                    }
                    if (_utc.getUTCDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getUTCDate())+ 1);
                    } else {
                        day = parseInt(_utc.getUTCDate()) + 1;
                    }
                    var _utc = _utc.getUTCFullYear() + "-" + month + "-" + day;
                    return _utc;
                }
            };
        })

        /**=========================================================
         * Provides a simple demo for bootstrap datepicker
         =========================================================*/

        App.controller('DatepickerDemoCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=============================================================
         * Provides a simple demo for bootstrap datepicker for reports
         =============================================================*/

        App.controller('DatepickerReportsCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=========================================================
         * Provides a simple demo for buttons actions
         =========================================================*/

        App.controller('ButtonsCtrl', ['$scope', function ($scope) {

            $scope.radioModel = 'Left';

        }]);

        /**=========================================================
         * Initializes the masked inputs
         =========================================================*/

        App.directive('masked', function () {
            return {
                restrict: 'A',
                controller: ["$scope", "$element", function ($scope, $element) {
                    var $elem = $($element);
                    if ($.fn.inputmask)
                        $elem.inputmask();
                }]
            };
        });

    }]);
