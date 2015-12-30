var utils = require("./../../../../js/utils.js");
utils.initIO(location.host + "/m2m");
//var app = angular.module('StarterApp', ['ngMaterial', 'ngMdIcons']);
var parser = new DOMParser();

angular.module('mediathequeModule', ['ngMaterial', 'angular-toArrayFilter'])
    .controller('mediathequeController',

        function ($scope, $sce, $http) {
            var ctrl = this;

            ctrl.bricks         = {};
            ctrl.saveBricksHome = {};
            $http.get('/getContext')
                .success(function (data) {
                    ctrl.context = data;

                    var i;
                    for (i in data.bricks) {
                        ctrl.bricks[i] = data.bricks[i];
                    }
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
                });
            var ilExisteDesMediatheques = ctrl.bricks.toString().length > 0;
            if (ilExisteDesMediatheques) {
                console.log("ON EST DANS LE IF");
                ctrl.saveBricksHome = ctrl.bricks;
            }

            ctrl.goBackToserversUpnP = function () {
                ctrl.bricks = ctrl.saveBricksHome;
                ctrl.containers = {};
                console.log("containers:", ctrl.containers);
                console.log("saveBricksHome:", ctrl.saveBricksHome);
                console.log("bricks  :", ctrl.bricks);
                console.log("idCurrentConteneur:", ctrl.idCurrentConteneur);
                console.log("idParentConteneur:", ctrl.idParentConteneur);
                console.log("bricks.length:", ctrl.bricks.toString().length > 0);
                //$scope.$apply();
            }

            ctrl.Browse = function (idMediaServeur, idConteneur, idCurrentConteneur1, itemUri) {
                //je fais l'appel au serveur tactab (nodejs) pour obtenir le contenu du repertoire identifie par
                //idConteneur present sur le serveur upnp identife par idMediaServeur
                ctrl.idCurrentMediaServer = idMediaServeur
                ctrl.idParentConteneur    = idCurrentConteneur1;
                ctrl.idCurrentConteneur   = idConteneur;
                if (ctrl.bricks) {
                    ctrl.currentBricks = ctrl.bricks;
                }
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
                    if (doc && (Result = doc.querySelector("Result"))) {
                        var docResult = parser.parseFromString(Result.textContent, "text/xml");
                        console.log(docResult);
                        var containersXML = docResult.querySelectorAll("container");
                        var mediasXML     = docResult.querySelectorAll("item");
                        ctrl.containers   = [];
                        ctrl.items        = [];
                        for (i = 0; i < containersXML.length; i++) {
                            ctrl.containers.push({
                                id: containersXML[i].getAttribute("id"),
                                title: containersXML[i].querySelector("title").textContent

                            });
                        }
                        for (i = 0; i < mediasXML.length; i++) {
                            ctrl.items.push({
                                id: mediasXML[i].getAttribute("id"),
                                title: mediasXML[i].querySelector("title").textContent,
                                uri: mediasXML[i].querySelector("res").textContent
                            });
                        }
                        console.log("containers:", ctrl.containers);
                        console.log("item:", ctrl.items);
                        console.log("idCurrentConteneur:", ctrl.idCurrentConteneur);
                        console.log("idParentConteneur:", ctrl.idParentConteneur);
                        console.log("currentBricks:", ctrl.currentBricks);
                        console.log("ctrl.bricks.length:", ctrl.bricks.length);
                        $scope.$apply();


                        console.log("item en dehors de la fonction:", ctrl.items);
                        ctrl.itemUri = itemUri;
                        console.log("ctrl.itemUri:", ctrl.itemUri);
                        if (ctrl.itemUri) {
                            console.log("on est dans le if");

                            $scope.detailFrame = $sce.trustAsResourceUrl(ctrl.itemUri);
                        }
                    }

                });

            }


        }
    )
    .directive("mediaBrowser", function () {
            return {
                restrict: "E",
                controller: function ($scope) {
                    //    toutes les methodes et attribut dont on a besoin
                    //    pour chaque instance mediabrowser
                    var ctrl                = this;
                    this.bricks             = $scope.bricks;
                    this.containers         = [];
                    this.currentMediaServer = null;

                    this.Browse = function (idMediaServeur, idConteneur) {
                        //je fais l'appel au serveur tactab (nodejs) pour obtenir le contenu du repertoire identifie par
                        //idConteneur present sur le serveur upnp identife par idMediaServeur
                        ctrl.idCurrentMediaServer = idMediaServeur;
                        ctrl.bricks               = {};
                        //res une chaine de caractere
                        utils.call(
                            idMediaServeur,
                            "Browse",
                            [idConteneur]
                        ).then(function (res) {
                            //console.log("res : ", res);
                            var doc = parser.parseFromString(res, "text/xml");
                            var Result, i;
                            if (doc && (Result = doc.querySelector("Result"))) {
                                var docResult = parser.parseFromString(Result.textContent, "text/xml");
                                console.log(docResult);
                                var containersXML = docResult.querySelectorAll("container");
                                var mediasXML     = docResult.querySelectorAll("item");
                                ctrl.containers   = [];
                                ctrl.items        = [];
                                for (i = 0; i < containersXML.length; i++) {
                                    ctrl.containers.push({
                                        id: containersXML[i].getAttribute("id"),
                                        title: containersXML[i].querySelector("title").textContent
                                    });
                                }
                                for (i = 0; i < mediasXML.length; i++) {
                                    ctrl.items.push({
                                        id: mediasXML[i].getAttribute("id"),
                                        title: mediasXML[i].querySelector("title").textContent,
                                        uri: mediasXML[i].querySelector("res").textContent
                                    });
                                }
                                console.log("containers test    :", ctrl.containers);
                                console.log("item:", ctrl.items);
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

