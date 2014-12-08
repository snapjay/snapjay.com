'use strict';

// Declare app level module which depends on filters, and services
angular.module('gameoflife', [])

.run([function(){

}])

    .controller('gol', ['$window', '$rootScope', '$interval', '$scope', '$state',
                 function($window, $rootScope, $interval, $scope, $state) {


        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

            if  (fromState.name == 'skills' ){
                $interval.cancel(Life.interval);
                Life.state = Life.STOPPED;
                Life = {};
            } else {
                angular.element($window).unbind('resize');
            }
        });

        Array.matrix = function (m, n, initial) {
            var a, i, j, mat = [];
            for (i = 0; i < m; i += 1) {
                a = [];
                for (j = 0; j < n; j += 1) {
                    a[j] = 0;
                }
                mat[i] = a;
            }
            return mat;
        };


        <!--TODO: Refactor document to $document / check window too! -->

        var gridCanvas = document.getElementById("golgrid");

        var Life = {};
            Life.CELL_SIZE = 10;
//            Life.X = 500;
//            Life.Y = 500;
            Life.X = 0;
            Life.Y = 0;
            Life.WIDTH = Life.X / Life.CELL_SIZE;
            Life.HEIGHT = Life.Y / Life.CELL_SIZE;
            Life.DEAD = 0;
            Life.ALIVE = 1;
            Life.DELAY = 100;
            Life.STOPPED = 0;
            Life.RUNNING = 1;

            Life.minimum = 2;
            Life.maximum = 3;
            Life.spawn = 3;

            Life.state = Life.STOPPED;
            Life.interval = null;

            Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);
            Life.age = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

            Life.counter = 0;

            Life.updateState = function() {
                var neighbours;

                var nextGenerationGrid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

                for (var h = 0; h < Life.HEIGHT; h++) {
                    for (var w = 0; w < Life.WIDTH; w++) {
                        neighbours = Life.calculateNeighbours(h, w);
                        if (Life.grid[h][w] !== Life.DEAD) {

                            if ((neighbours >= Life.minimum) &&
                                (neighbours <= Life.maximum)) {
                                nextGenerationGrid[h][w] = Life.ALIVE;
                                Life.age[h][w]++;
                            }
                        } else {
                            if (neighbours === Life.spawn) {
                                nextGenerationGrid[h][w] = Life.ALIVE;;
                                Life.age[h][w] = 0;
                            }
                        }
                    }
                }

                Life.copyGrid(nextGenerationGrid, Life.grid);
                Life.counter++;
            };

            Life.calculateNeighbours = function(y, x) {
                var total = (Life.grid[y][x] !== Life.DEAD) ? -1 : 0;
                for (var h = -1; h <= 1; h++) {
                    for (var w = -1; w <= 1; w++) {
                        if (Life.grid
                            [(Life.HEIGHT + (y + h)) % Life.HEIGHT]
                            [(Life.WIDTH + (x + w)) % Life.WIDTH] !== Life.DEAD) {
                            total++;
                        }
                    }
                }
                return total;
            };

            Life.copyGrid = function(source, destination) {
                for (var h = 0; h < Life.HEIGHT; h++) {
                    destination[h] = source[h].slice(0);
                }
            };

            Life.rand = function (min, max, int){
                var n = (Math.random() * max) + min;
                if (int) return  Math.floor(n)
                else return n
            }

            $scope.toggle = function() {
                switch (Life.state) {
                    case Life.STOPPED:
                        $scope.start();
                        break;
                    default:
                        $scope.pause();
                }
            };

            $scope.start = function(){
                Life.interval = $interval(function() {
                    $scope.update();
                }, Life.DELAY);
                Life.state = Life.RUNNING;
           }

            $scope.pause = function(){
               $interval.cancel(Life.interval);
               Life.state = Life.STOPPED;
           }

            $scope.reset = function() {
                Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);
                Life.counter = 0;
                $interval.cancel(Life.interval);
                Life.state = Life.STOPPED;
                $scope.updateAnimations();
            };

            $scope.seed = function(count, fromX,toX, fromY, toY) {
                if (!count) count = 10;
                if (!fromX) fromX = 0;
                if (!toX) toX = Life.WIDTH;
                if (!fromY) fromY = 0;
                if (!toY) toY = Life.HEIGHT;

                for (var y = 0; y <= count; y++) {
                    if (Life.grid[Life.rand(fromX, toX, true)][Life.rand(fromY, toY, true)] == Life.ALIVE){
                       // y--;
                    } else {
                        Life.grid[Life.rand(fromX, toX, true)][Life.rand(fromY, toY, true)] = Life.ALIVE;
                    }
                }
            };

            $scope.update = function() {
                 if ($scope.generation % 100 === 0 && $scope.generation > 1 ){

//                     if ($scope.population < ((Life.HEIGHT*Life.WIDTH)/8)) {
//
//                         $scope.seed(((Life.HEIGHT*Life.WIDTH)/8) - $scope.population, 0, Life.HEIGHT, 0, Life.WIDTH);
//                     }

                     $scope.seed(parseInt((Life.HEIGHT*Life.WIDTH)/15), 0, Life.HEIGHT, 0, Life.WIDTH);

                }

                Life.updateState();
                $scope.updateAnimations();
            };

            $scope.updateAnimations = function() {
                var population = 0;
                var colors = ['#cde3f9', '#d4e7fa', '#deebf9', '#e8f1fa', '#f3f7fb' ]
                var color;
                for (var h = 0; h < Life.HEIGHT; h++) {
                    for (var w = 0; w < Life.WIDTH; w++) {
                        if (Life.grid[h][w] === Life.ALIVE) {
                           // log (Life.age[h][w]);
                            var age =  Math.floor(Life.age[h][w]/50)
                            if (age == 0){ //young
                                color = colors[Life.rand(0, colors.length-2, true)];
                            }  else {
                                color = colors[colors.length-1];
                            }
                            $scope.context.fillStyle = color;
                            population++;
                        } else {
                            $scope.context.fillStyle = "#fff";
                            //context.clearRect();
                        }
                        $scope.context.fillRect(
                            w * Life.CELL_SIZE +1,
                            h * Life.CELL_SIZE +1,
                            Life.CELL_SIZE -1,
                            Life.CELL_SIZE -1);
                    }
                }
                $scope.population = population;
                $scope.generation = Life.counter;

            };



        angular.element($window).bind('resize', function(){
            if ($state.current.name !== 'skills') return;
            $scope.reset();
            $scope.canvasSetup();
            $scope.seed(parseInt((Life.HEIGHT*Life.WIDTH)/8), 0, Life.HEIGHT, 0, Life.WIDTH);
            $scope.start();

        });

        $scope.canvasSetup = function(){

            if (gridCanvas.getContext) {

                var body = document.body,
                    html = document.documentElement;

                gridCanvas.style.display = 'none'; // Don't count canvas on page size
                  var screenWidth =  document.body.clientWidth - 10;
                  var screenHeight =  Math.max( body.scrollHeight, body.offsetHeight,  html.clientHeight, html.scrollHeight, html.offsetHeight ) - 10;
                gridCanvas.style.display = 'block';
                Life.X = screenWidth;
                Life.Y = screenHeight;

                Life.WIDTH = parseInt(Life.X / Life.CELL_SIZE);
                Life.HEIGHT = parseInt(Life.Y / Life.CELL_SIZE);

                Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);
                Life.age = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

                gridCanvas.width = screenWidth;
                gridCanvas.height = screenHeight;

                $scope.context = gridCanvas.getContext('2d');



                var offset = Life.CELL_SIZE;

                for (var x = 0; x <= Life.X; x += Life.CELL_SIZE) {
                    $scope.context.moveTo(0.5 + x, 0);
                    $scope.context.lineTo(0.5 + x, Life.Y);
                }
                for (var y = 0; y <= Life.Y; y += Life.CELL_SIZE) {
                    $scope.context.moveTo(0, 0.5 + y);
                    $scope.context.lineTo(Life.X, 0.5 + y);
                }
                $scope.context.strokeStyle = "#fff";
                $scope.context.stroke();


                $scope.updateAnimations();


            } else {
                log.error('No Canvas');
            }
        }

        $scope.canvasSetup();
        $scope.seed(parseInt((Life.HEIGHT*Life.WIDTH)/8), 0, Life.HEIGHT, 0, Life.WIDTH);

        $scope.start();


    }])






.directive('gameoflife', ['version', function(version) {
    return {
        restrict: 'E',
        scope : {
            size : '@'
        },
        templateUrl: 'partials/gameoflife.html',
        link:function(scope, element, attrs){

        },
        controller:'gol'
    }
}])

;


