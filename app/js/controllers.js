'use strict';

/* Controllers */

angular.module('snapjay.controllers', [])


  .controller('play', ['$scope', '$analytics', function($scope, $analytics) {

        $scope.icons = [
            {filename:'gun.svg', title:'Gun' },
            {filename:'football.svg', title:'Football' },
            {filename:'jeep.svg', title:'Jeep' },
            {filename:'food.svg', title:'Food' },
            {filename:'boot.svg', title:'Cowboy' },
            {filename:'hockey.svg', title:'Hockey' }
        ];


        $scope.setActive = function(a){

            $analytics.eventTrack('eventName', {  category: 'Play', label: a });

            if ($scope.active == a){
                $scope.active = undefined;
            } else {
                $scope.active = a;

            }
        };

        setTimeout(function(){

//            TweenMax.to(_$('#plane'), 41, {left:'110%', repeat:-1, delay:2, repeatDelay:80,  ease:Linear.easeNone});
//             TweenMax.to(_$('#planeLefttail'),0.1, {fill:'#000', repeat:-1, yoyo:true, delay:0.2, repeatDelay:1.9,  ease:Linear.easeNone});
////            TweenMax.to(_$('#planeRighttail'),0, {color:1, repeat:-1, yoyo:true, delay:0.35, repeatDelay:1.9, ease:Linear.easeNone});
////           TweenMax.to(_$('#planeFrontttail'),0, {color:1, repeat:-1, yoyo:true, delay:0.4, repeatDelay:1.9, ease:Linear.easeNone});

            TweenMax.to(_$("#sky"), 480, {rotation:360,  repeat:-1 ,ease:Linear.easeNone});
            TweenMax.to(_$('#shootingstar'), 0.4, {width:75, left:'+=150',top:'+=150',
                                                  opacity:0, ease:Linear.easeNone, autoRound:false, repeat :-1,delay:15, repeatDelay:29 });


        }, 175);

  }])


  .controller('credits', ['$rootScope', '$scope', function($rootScope, $scope) {


          setTimeout(function(){
            TweenMax.to(_$(".blades"), 10, {rotation:360, repeat:-1,ease:Linear.easeNone});
            TweenMax.to(_$('#tractor'), 740, {left:3400});
            TweenMax.to(_$('.tractor'), 0.1, {top:'+=1', repeat:-1, yoyo:true, ease:Linear.easeNone});
            TweenMax.to(_$('.wheelb'), 13, {rotation:360, repeat:-1,ease:Linear.easeNone});
            TweenMax.to(_$('.wheelf'), 13, {rotation:360, repeat:-1,ease:Linear.easeNone});

       }, 175);
  }])

