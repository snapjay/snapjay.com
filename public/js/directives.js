'use strict';

/* Directives */


angular.module('snapjay.directives', [])


    .directive('navmenu', [function() {
    return {
        restrict: 'E',
        scope : {
            active : '@'
        },
        templateUrl: 'partials/navmenu.html',
        link:function(scope, element, attr){

        },
        controller:['$scope', '$window', function($scope, $window){

        }]


    };
  }])

    .directive('sky', ['version', function(version) {
    return {
        restrict: 'E',
        transclude: true,
        scope : {
            time : '&'
        },
        templateUrl: 'partials/sky.html',
        link:function(scope, element, attr){
            scope.stars = [];
            var i =0;
            while (i < attr.stars) {
                scope.stars.push(
                    {
                        id: i,
                        ascension:rand(2, 2000),
                        declination:rand(2, 2000),
                        size:rand(0.5, 3)
                    }
                );
                i++;
            }


        },
        controller:['$scope', '$window', function($scope, $window){




        }]


    }
  }])
    .directive('star', ['version', function(version) {
    return {
        restrict: 'E',
        scope : {
            size : '@'
        },
        template: '',
        link:function(scope, element, attrs){

             var colors = ['#fff', '#fff', '#EDEDF7', '#FFEFEF'];
            setTimeout(function( ){

                if (attrs.declination > window.innerHeight){ // Don't animate anyhting out of viewport = more stars yay!
                    element.css({
                        left:attrs.ascension + 'px',
                        top:attrs.declination + 'px'
                    });

                } else {
                    TweenLite.to(element, 3, {
                        left:attrs.ascension + 'px',
                        top:attrs.declination + 'px',
                        ease:Power4.easeOut
                        // ease:Elastic.easeOut
                    });
                }


                element.css('height', attrs.size + 'px').css('width', attrs.size + 'px').css('backgroundColor', colors[parseInt(rand(0,colors.length))]);

               // if (parseInt(rand(0,2)) == 1) TweenMax.from(element,  rand(0.5,0.6), {opacity:rand(0.5,0.7), repeat:-1, yoyo:true, ease:Linear.easeNone});
              // if (parseInt(rand(0,1)) == 1) TweenLite.from(element, rand(0,2), {opacity:rand(0.2,0.7), repeat:-1, yoyo:true, ease:Linear.easeNone});
//               if (parseInt(attrs.size) < 1) TweenMax.from(element,  rand(0.2,0.5), {opacity:rand(0.3,0.6), repeat:-1, yoyo:true, ease:Linear.easeNone});

            }, 75)

        },
        controller:['$scope', function($scope){

        }]
    }
  }])



;
function rand(min, max) {
    return Math.random() * (max - min) + min;
}