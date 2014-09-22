/**
 * Created by @phipex on 19/09/2014.
 */
var OpenLayersLoadFile = {};

/**
 * Verifica si el navegador es compatible con los metodos para
 * crear archivos (Blob y FileReader)
 * @returns {boolean} true: si es compatible o false en el caso contrario
 */
OpenLayersLoadFile.IsCompatible=function(){

    if(!window.OpenLayers){
        throw "OpenLayers es Necesario";

    }

    var blobCompatibility = this.isBlobCompatible() || this.isBlobBuilderCompatible();

    var res = (window.URL || window.webkitURL) !== null &&
              (window.FileReader !== null ) &&
              blobCompatibility;

    return res;
};

/**
 *
 * @returns {boolean}
 */
OpenLayersLoadFile.isBlobCompatible = function(){
    var res = false;

    if(window.Blob ||
        window.WebKitBlob ||
        window.MozBlob ||
        window.MSBlob){
        res = true;
    }

    OpenLayersLoadFile.isBlobCompatible = function(){
        return res;
    };

    return res;
};

/**
 *
 * @returns {boolean}
 */
OpenLayersLoadFile.isBlobBuilderCompatible = function(){
    var res = false;

    if(window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder){
        res = true;
    }

    OpenLayersLoadFile.isBlobBuilderCompatible = function(){
        return res;
    };

    return res;
};

/**
 *
 * @param arrayTexto
 * @param mimetype
 * @returns {*}
 */
OpenLayersLoadFile.createBlob=function (arrayTexto, mimetype) {

    var type = mimetype || 'application/octet-stream';
    if(OpenLayersLoadFile.isBlobCompatible()){

        return new Blob(arrayTexto, {
            type: type
        });

    }else{
        var blobBuilderObj = new (window.BlobBuilder || window.WebKitBlobBuilder ||
            window.MozBlobBuilder || window.MSBlobBuilder)();
        blobBuilderObj.append(arrayTexto);
        return blobBuilderObj.getBlob(type);

    }


};

/**
 *
 * @param datafile
 * @param name
 * @param mimetype
 * @returns {boolean}
 */
OpenLayersLoadFile.createDownloadFile=function(datafile,name,mimetype){

    if (datafile) { //TODO crear el blob
        var texto = [];
        texto.push(datafile);
        //No olvidemos especificar el tipo MIME correcto :)
        var blob = OpenLayersLoadFile.createBlob(texto, mimetype);

        //TODO crear el file
        var reader = new FileReader();
        reader.onload = function (event) {
            var save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            save.download = name || 'archivo.dat';
            var clicEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            save.dispatchEvent(clicEvent);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };

        //TODO llamar el evento
        reader.readAsDataURL(blob);

        return true
    }
    return false;
};

OpenLayersLoadFile.downloadFile4Layer=function(layer,type,proj,name){
    //console.info("downloadFile4Layer:layer.features.length",layer.features.length);
    if(layer && layer.features.length > 0){

        var format = type || "kml";

        name = name || "misdatos";


        var formatOut = OpenLayersLoadFile.Format[format] || OpenLayersLoadFile.Format['kml'];

        var curProj = OpenLayersLoadFile.Format.getProj(proj,formatOut);


        var olFormat = formatOut.formaOut(layer.map,curProj);

        var mime = formatOut.mimetype;

        var exten = formatOut.fileExt;

        var projNane = curProj.split(':')[1];

        var str = olFormat.write(layer.features, true);
        // not a good idea in general, just for this demo
        str = str.replace(/,/g, ', ');

        var fileName = name +"_"+projNane+ "." + exten;
        OpenLayersLoadFile.createDownloadFile(str, fileName,mime);

        return true;
    }
    return false;
};

OpenLayersLoadFile.Format = {

    getOutOptions: function (map, proj) {
        var internalProjection = map.baseLayer.projection;


        var out_options = {
            'internalProjection': internalProjection,
            'externalProjection': new OpenLayers.Projection(proj)
        };
        return out_options;
    },
    getProj:function(proj,formatOut){

        var curProj = null;
        var listProj = formatOut.proj;
        var count = listProj.length;
        for (var i=0;i<count;i++) {

            if(listProj[i]===proj){
                curProj = proj;
            }
        }

        proj = curProj || "EPSG:4326";

        return proj;
    },

    'kml':{
        'proj':[
            "EPSG:4326"
        ],
        'mimetype':'application/xml',
        'fileExt':'kml',
        'formaOut':function(map,proj){

            var out_options = OpenLayersLoadFile.Format.getOutOptions(map, proj);
            return  new OpenLayers.Format.KML(out_options);

        }
    },

    'gml':{
        'proj':[
            "EPSG:4326",
            "EPSG:900913",
            "EPSG:3857"
        ],
        'mimetype':'application/xml',
        'fileExt':'gml',
        'formaOut':function(map,proj){

            var out_options = OpenLayersLoadFile.Format.getOutOptions(map,  proj);

            return  new OpenLayers.Format.GML.v3(out_options);

        }
    },

    'gpx':{
        'proj':[
            "EPSG:4326"
        ],
        'mimetype':'application/xml',
        'fileExt':'gpx',
        'formaOut':function(map,proj){

            var out_options = OpenLayersLoadFile.Format.getOutOptions(map, proj);

            return  new OpenLayers.Format.GPX(out_options);

        }
    }

};

//TODO lista de posibles valores a exportar
//TODO funcion que guarda el contenido del archivo en una funcion generica

//TODO funcion que guarda los archivos