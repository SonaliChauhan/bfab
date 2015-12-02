App.controller('dashboardController',['$scope', '$http', '$location', '$cookies', '$cookieStore', 'MY_CONSTANT', 'ngDialog', '$timeout', function($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, $timeout){

    $scope.myDataSource ={};
    $scope.myInvoiceData ={};
    $scope.optionsBooking = {
        data: [
            {
                'Bookings Made': 5,
                'Appointments Served': 10,
                indexBooking:10
            }
        ],
        dimensions: {
            'Bookings Made': {
                axis: 'y',
                type: 'line'
            },
            'Appointments Served': {
                axis: 'y',
                type: 'line'
            },
            indexBooking: {
                axis: 'x'
            }
        }
    };
    $scope.optionsInvoice = {
        data: [
            {
                'Invoiced Value': 0,
                'Average Service Value': 0,
                indexInvoice:0
            }
        ],
        dimensions: {
            'Invoiced Value': {
                axis: 'y',
                type: 'bar'
            },
            'Average Service Value': {
                axis: 'y',
                type: 'line'
            },
            'indexInvoice': {
                axis: 'x'
            }
        }
    };

    $scope.init = function(){
        var start_date = $scope.changeDateFormat($scope.start_date,'startDate');
        var end_date = $scope.changeDateFormat($scope.end_date, 'endDate');
        $.post(MY_CONSTANT.url + '/admin_dashboard_graphs', {
            access_token: $cookieStore.get('obj').accesstoken,
            from_date:start_date,
            to_date:end_date

        }, function (res) {
            $scope.data = res.data;
            $scope.populateGraphs($scope.data);
            /*console.log('Graphs: ');
            console.log(res);*/
        });
        $.post(MY_CONSTANT.url + '/admin_dashboard_tables', {
            access_token: $cookieStore.get('obj').accesstoken,
            from_date:$scope.start_date,
            to_date:$scope.end_date

        }, function (res) {
            $scope.tableData = res;
            $scope.populateTables($scope.tableData);
            /*console.log('Tables: ');
            console.log(res);*/
        });
    }


    $scope.populateGraphs = function(data){
        console.log("Graphs data:");
        console.log(data);
        var bookingGraph = data.yArr.booking_graph;
        var bookingMade = bookingGraph.booking_made;
        var bookingServed = bookingGraph.booking_served;
        $scope.dataBooking =[];
        $scope.dataAppointment = [];
        $scope.category = [];
        for(var i=0;i<bookingMade.length;i++){
            var booking = {};
            var index={};
            var appointment={};
            booking['value'] = bookingMade[i];
            booking['color'] = '#5B9BD5';
            appointment['value'] = bookingServed[i];
            appointment['color'] = '#ED7D31';
            index['label'] = data.xArr[i];
            $scope.category.push(index);
            $scope.dataBooking.push(booking);
            $scope.dataAppointment.push(appointment)
        }
        $scope.myDataSource ={
            "chart": {
                "height":"100%",
                "width":"100%",
                "plotgradientcolor": "",
                "showalternatehgridcolor": "0",
                "showplotborder": "0",
                "divlinecolor": "CCCCCC",
                "showvalues": "0",
                "showcanvasborder": "1",
                "slantlabels": "1",
                "legendshadow": "0",
                "legendborderalpha": "0",
                "theme": "zune",
                "showBorder": "0",
                "borderColor": "#000000",
                "borderThickness": "3",
                "borderAlpha": "100",
                "bgColor": "F5F7FA,F5F7FA",
                "bgAlpha" : "70,80",
                "bgRatio": "60, 40",
                "canvasBgAlpha": "0",
                "canvasBgColor":"#F5F7FA",
                "canvasBorderColor":"#D4D4D4",
                "canvasBorderThickness": "1",
                "canvasBorderAlpha": "80"
            },
            "categories": [
                {
                    "category": $scope.category
                }
            ],
            "dataset": [
                {
                    "seriesname": "Bookings Made",
                    "renderas": "line",
                    "data": $scope.dataBooking
                },
                {
                    "seriesname": "Appointments Served",
                    "renderas": "line",
                    "data": $scope.dataAppointment
                }
            ]
        }
        var invoiceGraph = data.yArr.invoice_graph;
        var invoiceMade = invoiceGraph.invoiced;
        var invoiceServed = invoiceGraph.avg_service_price;
        $scope.dataInvoice =[];
        $scope.dataInvoiceAverage = [];
        $scope.categoryInvoice = [];
        for(var i=0;i<invoiceMade.length;i++){
            var invoice = {};
            var indexInvoice={};
            var averageInvoice={};
            invoice['value'] = invoiceMade[i];
            invoice['color'] = '#5B9BD5';
            averageInvoice['value'] = invoiceServed[i];
            averageInvoice['color'] = '#ED7D31';
            indexInvoice['label'] = data.xArr[i];
            $scope.categoryInvoice.push(indexInvoice);
            $scope.dataInvoice.push(invoice);
            $scope.dataInvoiceAverage.push(averageInvoice)
        }

        $scope.myInvoiceData ={
            "chart": {
                "height":"100%",
                "width":"100%",
                "plotgradientcolor": "",
                "showalternatehgridcolor": "0",
                "showplotborder": "0",
                "divlinecolor": "CCCCCC",
                "showvalues": "0",
                "showcanvasborder": "1",
                "slantlabels": "1",
                "legendshadow": "0",
                "legendborderalpha": "0",
                "theme": "zune",
                "showBorder": "0",
                "borderColor": "#000000",
                "borderThickness": "3",
                "borderAlpha": "100",
                "bgColor": "F5F7FA,F5F7FA",
                "bgAlpha" : "70,80",
                "bgRatio": "60, 40",
                "canvasBgAlpha": "0",
                "canvasBgColor":"#F5F7FA",
                "canvasBorderColor":"#D4D4D4",
                "canvasBorderThickness": "1",
                "canvasBorderAlpha": "80"
            },
            "categories": [
                {
                    "category": $scope.categoryInvoice
                }
            ],
            "dataset": [
                {
                    "seriesname": "Invoiced Value",
                    "renderas": "bar",
                    "data": $scope.dataInvoice
                },
                {
                    "seriesname": "Average Service Value",
                    "renderas": "line",
                    "data": $scope.dataInvoiceAverage
                }
            ]
        }

        $scope.coloursBook = [{
            fillColor: '#5B9BD5',
            strokeColor: '#5B9BD5',
            highlightFill: '#5B9BD5',
            highlightStroke: '#5B9BD5'
            },
            {
                fillColor: '#ED7D31',
                strokeColor: '#ED7D31',
                highlightFill: '#ED7D31',
                highlightStroke: '#ED7D31'
            }];
        $scope.seriesFuture = ['Future Appointments', '12 Week Average'];
        $scope.seriesCustomer = ['Average Customer Rating'];
        $scope.seriesStaff = ['TOTAL Staff Availability (hours)', '12 Week Average'];

        var futureBooking = data.yArr.future_bookings_graph;
        var customerRating = data.yArr.customer_rating_graph;
        var staffAvailability = data.yArr.staff_availability_graph;
        $scope.futureBooking = [futureBooking.future_count, futureBooking.week_avg ];
        $scope.customerBooking =[customerRating.avg_rating];
        $scope.staffBooking = [staffAvailability.total_hours, staffAvailability.week_avg];
        $scope.labelBookings = data.xArr;

        $scope.$apply();
    }
    
    var roundUp = function(data) {
      for(var value in data) {
          data[value] = data[value].toFixed(2);
      }  
    };
    
    $scope.populateTables = function(res){
        console.log("table data:");
        console.log(res);
        var bookingDatatable = res.data.booking_table;
        var futureBooking = res.data.future_bookings_table;
        var customerRating = res.data.customer_rating_table;
        var invoiceDataTable = res.data.invoice_table;
        $scope.upcomingBooking = res.data.upcoming_booking_table;
        var staffAvailability = res.data.staff_availability_table;
        roundUp(futureBooking.week_avg);
        $scope.bookingMadePlot = bookingDatatable.booking_made;
        $scope.bookingServedPlot = bookingDatatable.booking_served;
        $scope.labelBooking = bookingDatatable.column_headers;
        $scope.futureBookingCount= futureBooking.future_count;
        $scope.futureBookingAverage = futureBooking.week_avg;
        $scope.labelFutureBooking = futureBooking.column_headers;
        $scope.customerBookingAverage = customerRating.avg_rating;
        $scope.customerBookingPercent = customerRating.customer_perentage;
        $scope.labelCustomer = customerRating.column_headers;
        $scope.staffAvailabiltyHours = staffAvailability.total_hours;
        $scope.staffAvailabiltyAverage = staffAvailability.week_avg;
        $scope.labelStaff = staffAvailability.column_headers;
        $scope.invoiced = invoiceDataTable.invoiced;
        $scope.discounts = invoiceDataTable.discounts;
        $scope.staff_cost = invoiceDataTable.staff_cost;
        $scope.gross_margin = invoiceDataTable.gross_margin;
        $scope.avg_service_price = invoiceDataTable.avg_service_price;
        $scope.labelInvoiced = invoiceDataTable.column_headers;
    }

    $scope.changeDateFormat = function(date, dateInterval){
        if(date){
            var date = new Date(date);
            var date_appointment = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            return date_appointment;
        }
        else{
            if(dateInterval=="endDate"){
                var dateNextWeek = moment();
                dateNextWeek.add(7, 'days');
                var date = new Date(dateNextWeek);
                var date_appointment = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
                $scope.end_date = date_appointment;
                return date_appointment;
            }
            else{
                var dateToday = new Date();
                var date_appointmentToday = dateToday.getFullYear() + '/' + (dateToday.getMonth() + 1) + '/' + dateToday.getDate();
                $scope.start_date = date_appointmentToday;
                return date_appointmentToday;
            }
        }

    }

    $scope.$watch('start_date',function(oldVal,newVal){
        if(oldVal!=newVal){
            $scope.init();
        }
    },true);

    $scope.$watch('end_date',function(oldVal,newVal){
        if(oldVal!=newVal){
            $scope.init();
        }
    },true);

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.openEnd = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedEnd = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    $scope.init();
}]);

App.filter('changeDateFormat',function($filter)
{
    return function(date) {
        if(date){
            var date = new Date(date);
            var date_appointment = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            return date_appointment;
        }
        return "";
    }});

App.controller('DashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.current = {};
    $scope.gross = {};
    $scope.registered = {};
    $.post(MY_CONSTANT.url + '/dashboard', {
        access_token: $cookieStore.get('obj').accesstoken

    }, function (data) {
        data = JSON.parse(data);
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
        //console.log(data);
        $scope.current.totalrevenue = data.daily_revenue;
        $scope.current.servicescompleted = data.daily_completed;
        $scope.current.servicesscheduled = data.daily_pending;

        $scope.gross.totalrevenue = data.total_revenue;
        $scope.gross.servicescompleted = data.total_completed;
        $scope.gross.servicesscheduled = data.total_pending;

        $scope.registered.users = data.total_users;
        $scope.registered.sp = data.total_technicians;
        $scope.$apply();

    });

});