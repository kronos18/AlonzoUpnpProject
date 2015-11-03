/**
 * Created by Miage on 02/11/2015.
 */
/**
 * Created by Miage on 02/11/2015.
 */


require ("./controllerIHM.css");
var utils = ("../../js/utils.js")
    , context ={bricks:{}}
;

// var interact = require ("../bower_components/interact/dist/interact.min.js");

utlis.initIO(location.hostname + " " + location.port +"m2m" ) ;

var app =
    angular .module("ihmActivity" ,["ngMaterial","ui.router","angular-toArrayFilter"]
        .controller ( "TActHa)bIHMController"
            , function ($scope,$http){
                var  ctrl = this;
                ctrl.context = context;
                $http .get ('/getConctext')
                    .success ( function(data){
                        ctrl.context= data;
                        console.log("ctrl.context" , ctrl.context);
                        utils.io.on("brickAppears"
                            , function(data) {
                                console.log("brickAppears", data);
                                ctrl.context.bricks[data.id] = data;
                                $scope.$apply();
                            });

                        utils.io.on ("brickDisappears"
                                    , function (data){
                                        console.log("brickDisappears,data");
                                        delete ctrl.context.bricks[data.brickId];
                                        $scope.$apply();
                         });
                            })
            }
        )
    )
            ;
            require ("./brick/brick.js")(app);
            require ("./mediaPlayer.js")(app);