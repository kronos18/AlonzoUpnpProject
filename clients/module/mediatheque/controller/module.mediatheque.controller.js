//'use strict';
//
////    definir un fichier css (voir bootstrap pour ca)
////require("./controllerIHM.css");
////var utils = ("../../js/utils.js"),
//var path = require('path'),
//    //angular= require('angular'),/
//    utils = path.resolve('./js/utils.js'),
//    context = {bricks: {}};
//console.dir(utils);
//// var interact = require ("../bower_components/interact/dist/interact.min.js");
////console.log('++++++++++++++++++++++++++++++++++++++++++++');
////console.log('location.hostname : ' + global.hostname);
////console.log('location.port : ' + location.port);
////console.log('++++++++++++++++++++++++++++++++++++++++++++');
////utils.initIO(location.hostname + " " + location.port + "m2m");
//
//var app = angular.module("mediatheque", ["ngMaterial", "ui.router", "angular-toArrayFilter"]
//    .controller ('mediathequeController',
//        function ($scope, $http) {
//            var ctrl = this;
//            ctrl.context = context;
//            $http.get ('/getConctext')
//                .success (function (data) {
//                    ctrl.context = data;
//                    console.log("ctrl.context", ctrl.context);
//                    utils.io.on("brickAppears"
//                        , function (data) {
//                            console.log("brickAppears", data);
//                            ctrl.context.bricks[data.id] = data;
//                            $scope.$apply();
//                        });
//                    utils.io.on ("brickDisappears"
//                        , function (data) {
//                            console.log("brickDisappears,data");
//                            delete ctrl.context.bricks[data.brickId];
//                            $scope.$apply();
//                        });
//                })
//        }
//    ));
//require("./brick/brick.js")(app);
//require("./mediaPlayer.js")(app);