/**
 * Created by fmontoya on 19/09/2014.
 */
describe("OpenLayers Load File",function(){

    var format = new OpenLayers.Format.WKT();

    var wktPunto = "POINT(-8375052.313984375 734763.1832983434)";

    var featurePunto = format.read(wktPunto);
    featurePunto.attributes = {'name':'soy un punto muy feo y ademas estoy mal proyectado'};
    var wktPoligono = "POLYGON((-77.34375 7.9921889305115, -80.859375 0.96093893051147, -73.828125 -2.5546860694885, -66.09375 -1.8515610694885, -64.6875 5.8828139305115, -73.125 11.507813930511, -80.859375 15.726563930511, -77.34375 7.9921889305115))";

    var featurePoligono = format.read(wktPoligono);
    featurePoligono.attributes = {'name':'soy un poligono muy feo y ademas estoy mal proyectado'};
    var wktLinea = "LINESTRING(1 1, 5 5, 10 10, 20 20)";

    var featureLinea = format.read(wktLinea);
    featureLinea.attributes = {'name':'soy una linea muy feo y ademas estoy mal proyectado'};


    describe("Cuando cargo la pagina",function(){

        it("Verifico si carga openlayers",function(){

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                OpenLayersLoadFile.IsCompatible();
            }catch(e) {
                valorEvaluado = false;
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("verifico si es compatible",function(){

            var valorEsperado = true;

            var valorEvaluado = OpenLayersLoadFile.IsCompatible();

            expect(valorEvaluado).toBe(valorEsperado);

        });


    });


    describe("Cuando deseo desacargar un archivo", function () {

        it("descargo archivo generico", function () {

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                valorEvaluado =OpenLayersLoadFile.createDownloadFile("esto es un archivo","nombre");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });


        it("descargo archivo generico sin nombre", function () {

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                valorEvaluado = OpenLayersLoadFile.createDownloadFile("esto es un archivo");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("descargo archivo sin contenido", function () {

            var valorEsperado = false;

            var valorEvaluado = true;

            try{
                valorEvaluado =OpenLayersLoadFile.createDownloadFile();
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("cuando deseo descargar un layer en kml con proyeccion implicita que no recibe", function () {

            //vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
            var map = new OpenLayers.Map('map');

            var vectors = new OpenLayers.Layer.Vector("Vector Layer");

            var osm = new OpenLayers.Layer.OSM();

            map.addLayers([osm,vectors]);

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'kml',"EPSG:4654","malaproj");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

    });

    describe("cuando deseo descargar la representacion de un layer", function () {

        var map = new OpenLayers.Map('map');

        var vectors = new OpenLayers.Layer.Vector("Vector Layer");

        var osm = new OpenLayers.Layer.OSM();

        map.addLayers([osm,vectors]);

       /* var format = new OpenLayers.Format.WKT();

        var wktPunto = "POINT(-8375052.313984375 734763.1832983434)";

        var featurePunto = format.read(wktPunto);
        featurePunto.attributes = {'name':'soy un punto muy feo y ademas estoy mal proyectado'};


        var wktPoligono = "POLYGON((-8609866.86484375 892585.6897064677, -8844681.415703125 106976.24766326026, -8140237.763125 -206150.71951301052, -7748880.178359374 -598348.1472311805, -7592337.144453125 185268.7974820049, -7670608.66140625 656025.5078637642, -8061966.246171875 813612.501474425, -8061966.246171875 1289744.8554938452, -8218509.280078125 1530333.8494714496, -8609866.86484375 892585.6897064677))";

        var featurePoligono = format.read(wktPoligono);
        featurePoligono.attributes = {'name':'soy un poligono muy feo y ademas estoy mal proyectado'};

        var wktLinea = "LINESTRING(-7670608.66140625 1449915.9734057544, -8296780.79703125 577387.333288245, -8609866.86484375 -206150.71951301052, -8531595.347890625 -834659.0784410278, -8061966.246171875 -992815.1675384839, -7592337.144453125 -913667.3751124564)";

        var featureLinea = format.read(wktLinea);
        featureLinea.attributes = {'name':'soy una linea muy feo y ademas estoy mal proyectado'};*/

        it("cuando deseo descargar de un layer nulo", function () {
            var valorEsperado = false;

            var valorEvaluado = true;

            try{
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer();
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);


        });

        it("cuando deseo descargar de un layer vacio", function () {

            var valorEsperado = false;

            var valorEvaluado = true;

            try{
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors);
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });


        it("cuando deseo descargar de un layer sin parametros", function () {

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors);
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

    });


    describe("cuando deseo descargar la representacion de un layer en 4326", function () {

        var map = new OpenLayers.Map('map');

        var vectors = new OpenLayers.Layer.Vector("Vector Layer");

        var osm = new OpenLayers.Layer.OSM();

        map.addLayers([osm,vectors]);

      /*  var format = new OpenLayers.Format.WKT();

        var wktPunto = "POINT(-8375052.313984375 734763.1832983434)";


        var featurePunto = format.read(wktPunto);
        featurePunto.attributes = {'name':'soy un punto muy feo y ademas estoy mal proyectado'};
        var wktPoligono = "POLYGON((-8609866.86484375 892585.6897064677, -8844681.415703125 106976.24766326026, -8140237.763125 -206150.71951301052, -7748880.178359374 -598348.1472311805, -7592337.144453125 185268.7974820049, -7670608.66140625 656025.5078637642, -8061966.246171875 813612.501474425, -8061966.246171875 1289744.8554938452, -8218509.280078125 1530333.8494714496, -8609866.86484375 892585.6897064677))";

        var featurePoligono = format.read(wktPoligono);
        featurePoligono.attributes = {'name':'soy un poligono muy feo y ademas estoy mal proyectado'};
        var wktLinea = "LINESTRING(-7670608.66140625 1449915.9734057544, -8296780.79703125 577387.333288245, -8609866.86484375 -206150.71951301052, -8531595.347890625 -834659.0784410278, -8061966.246171875 -992815.1675384839, -7592337.144453125 -913667.3751124564)";

        var featureLinea = format.read(wktLinea);
        featureLinea.attributes = {'name':'soy una linea muy feo y ademas estoy mal proyectado'};
*/

        it("cuando deseo descargar un layer en kml", function () {

            vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                //console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,"kml");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("cuando deseo descargar un layer en kml con proyeccion implicita", function () {

            vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'kml',"EPSG:4326");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("cuando deseo descargar un layer en gml", function () {
            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'gml',"EPSG:4326");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);
        });

        it("cuando desero descargar un layer en GPX", function () {
            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'gpx',"EPSG:900913");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });


    });

    describe("cuando deseo descargar la representacion de un layer en 900913", function () {

        var map = new OpenLayers.Map('map');

        var vectors = new OpenLayers.Layer.Vector("Vector Layer");

        var osm = new OpenLayers.Layer.OSM();

        map.addLayers([osm,vectors]);




        it("cuando deseo descargar un layer en kml", function () {

            vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);



            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'kml',"EPSG:900913");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("cuando deseo descargar un layer en gml", function () {

            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'gml',"EPSG:900913");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });

        it("cuando desero descargar un layer en GPX", function () {
            var valorEsperado = true;

            var valorEvaluado = true;

            try{
                vectors.addFeatures([featurePunto,featurePoligono,featureLinea]);
                console.info(vectors);
                valorEvaluado =OpenLayersLoadFile.downloadFile4Layer(vectors,'gpx',"EPSG:900913");
            }catch(e) {
                valorEvaluado = false;
                console.info(e);
            }

            expect(valorEvaluado).toBe(valorEsperado);

        });


    });

});