var utils=require("./../../../../js/utils.js");
utils.initIO(location.host +"/m2m");
//var app = angular.module('StarterApp', ['ngMaterial', 'ngMdIcons']);
var parser = new DOMParser();

angular.module('mediathequeModule', ['ngMaterial', 'angular-toArrayFilter'])
    .controller('mediathequeController',
        function ($scope, $http) {
            var ctrl = this;

            ctrl.bricks = {};
            $http.get('/getContext')
                .success(function (data) {
                    //ctrl.context = data;

                    var i;
                    for(i in data.bricks) {ctrl.bricks[i] = data.bricks[i];}

                    console.log("ctrl.context", ctrl.context);
                    utils.io.on("brickAppears"
                        , function (data) {
                            console.log("brickAppears", data);
                            ctrl.bricks[data.id] = data;
                            $scope.$apply();
                        });
                    utils.io.on("brickDisappears"
                        , function (data) {
                            console.log("brickDisappears,data");
                            delete ctrl.bricks[data.brickId];
                            $scope.$apply();
                        });
                })
        }
    )
    .directive("mediaBrowser", function () {
            return {
                restrict: "E",
                controller: function ($scope) {
                    //    toutes les methodes et attribut dont on a besoin
                    //    pour chaque instance mediabrowser
                    var ctrl = this;
                    this.bricks = $scope.bricks;
                    this.containers = [];
                    this.currentMediaServer = null;

                    this.Browse = function (idMediaServeur, idConteneur) {
                        //je fais l'appel au serveur tactab (nodejs) pour obtenir le contenu du repertoire identifie par
                        //idConteneur present sur le serveur upnp identife par idMediaServeur
                        ctrl.idCurrentMediaServer = idMediaServeur;
                        ctrl.bricks = {};
                        //res une chaine de caractere
                        utils.call(
                            idMediaServeur,
                            "Browse",
                            [idConteneur]
                        ).then(function (res) {
                            //console.log("res : ", res);
                            var doc = parser.parseFromString(res, "text/xml");
                            var Result, i;
                            if( doc && (Result = doc.querySelector("Result")) ) {
                                var docResult = parser.parseFromString(Result.textContent, "text/xml");
                                console.log(docResult);
                                var containersXML   = docResult.querySelectorAll("container");
                                var mediasXML       = docResult.querySelectorAll("media");
                                ctrl.containers     = [];
                                for(i=0;i<containersXML.length; i++) {
                                    ctrl.containers.push( {
                                        id      : containersXML[i].getAttribute("id"),
                                        title   : containersXML[i].querySelector("title").textContent
                                    });
                                }
                                console.log("containers:", ctrl.containers);
                                $scope.$apply();
                            }
                        })


                    }
                },
                controllerAs: "ctrl",
                templateUrl: "/clients/module/mediatheque/view/mediaBrowser.html",
                scope: {
                    bricks: "=bricks",
                    //comment j'interprete la valeur de cet attribut
                    //le resultat sera transmit
                    title: "@title"
                }

            }
        }
    )

