'use strict';

function log(a){ console.log(a);}
function _$(a){
    return document.querySelector(a);
}
// Declare app level module which depends on filters, and services
angular.module('snapjay', [
  'ui.router', 'angulartics', 'angulartics.google.analytics',
  'snapjay.filters',
  'snapjay.services',
  'snapjay.directives',
  'snapjay.controllers',
  'gameoflife',
  'templates'
]).
config(['$urlRouterProvider', '$locationProvider', '$stateProvider', function($urlRouterProvider,$locationProvider, $stateProvider) {

//        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        $stateProvider.state('snapjay', {
            url: "/",
            views: {
                "bg": {
                    template: ""
                },
                "fg": {
                    templateUrl:  "partials/snapjay.fg.html"
                }
            }

        });

        $stateProvider.state('skills', {
            url: "/skills",
            views: {
            "bg": {
                templateUrl:  "partials/skills.bg.html"
            },
            "fg": {
                templateUrl:  "partials/skills.fg.html"
            }
        }
        });

        $stateProvider.state('credits', {
            url: "/credits",
            views: {
                "bg": {
                    templateUrl:  "partials/credits.bg.html"
                },
                "fg": {
                    templateUrl:  "partials/credits.fg.html",
                    controller: "credits"
                }
            }
        });

        $stateProvider.state('play', {
            url: "/play",
            views: {
                "bg": {
                    templateUrl:  "partials/play.bg.html",
                    controller: "play"
                },
                "fg": {
                    templateUrl:  "partials/play.fg.html",
                    controller: "play"
                }
            }
        });


        $stateProvider.state('contact', {
            url: "/contact",
            views: {
                "bg": {
                    templateUrl:  "partials/contact.bg.html"
                },
                "fg": {
                    templateUrl:  "partials/contact.fg.html"
                }
            }
        });

}])

.run(['$rootScope', function($rootScope){

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
              TweenMax.killAll();
   

//              TweenMax.to(document.getElementById('bg'), 0, {opacity:0});
//            log (toState.name);
//            TweenMax.to(_$('body'), 2, {className:toState.name});

        });

        $rootScope.$on('$stateChangeSuccess', function(event,toState){
//            TweenMax.to(document.getElementById('bg'), 1, {opacity:1, ease:Power4.easeIn});
            $rootScope.page = toState.name;

            var titlePre = 'snapjay';
            if (toState.name === 'contact') $rootScope.title = titlePre +  ' - Contact';
            else if (toState.name === 'play') $rootScope.title = titlePre +  ' - Play';
            else if (toState.name === 'credits') $rootScope.title = titlePre +  ' - Credits';
            else if (toState.name === 'skills') $rootScope.title = titlePre +  ' - Skills';
            else $rootScope.title = titlePre +  ' - An experienced frontend web developer.';

        });


    }])
;
