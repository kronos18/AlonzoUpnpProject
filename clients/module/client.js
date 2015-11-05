/**
 * Created by jack on 05/11/15.
 */
//'use strict';
require("./client.css");
//    definir un fichier css (voir bootstrap pour ca)
//require("./controllerIHM.css");
//var utils = ("../../js/utils.js"),
//var path = require('path'),
//angular= require('angular'),/
var utils = require('../../js/utils.js'),
    context = {bricks: {}};
console.dir(utils);
// var interact = require ("../bower_components/interact/dist/interact.min.js");
//console.log('++++++++++++++++++++++++++++++++++++++++++++');
//console.log('location.hostname : ' + global.hostname);
//console.log('location.port : ' + location.port);
//console.log('++++++++++++++++++++++++++++++++++++++++++++');
utils.initIO(location.hostname + ":" + location.port + "/m2m");

angular.module("mediatheque", ["ngMaterial"])
    .controller('mediathequeController',
    function ($scope, $http) {
        var ctrl = this;
        ctrl.context = context;
        $http.get('/getContext')
            .success(function (data) {
                ctrl.context = data;
                console.log("ctrl.context", ctrl.context);
                utils.io.on("brickAppears"
                    , function (data) {
                        console.log("brickAppears", data);
                        ctrl.context.bricks[data.id] = data;
                        $scope.$apply();
                    });
                utils.io.on("brickDisappears"
                    , function (data) {
                        console.log("brickDisappears,data");
                        delete ctrl.context.bricks[data.brickId];
                        $scope.$apply();
                    });
            })
    }
);
