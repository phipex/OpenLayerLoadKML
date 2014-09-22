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
//TODO verificar si es un array
/**
 * Crea el objeto tipo blob con el array de datos y el mimetype
 * @param arrayTexto array con la info a crear el blob
 * @param mimetype mimetype del archivo, si no se agrega se toma 'application/octet-stream'
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
 * Crea un archivo con determinada mimetype y nombre
 * @param datafile contenido del archivo
 * @param name nombre del archivo (debe contener la extension)
 * @param mimetype mimetype del archivo
 * @returns {boolean} retorna verdadero si pudo generar el archivo y la descarga
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

/**
 * Crea y descarga un archivo en determinado formato con la informacion vectorial del layer del parametro
 * -solo acepta layer que tenga features
 * - en caso de no ingresar el tipo el pone por defecto kml
 * - si no le agrega el nombre el coloca "misdatos"
 * - si el formato que ingreso no esta en la lista de formatos configurado, el lo crea con kml
 * - cada formato tiene una lista de epsg permitidas, si no esta dentro de esa lista el usa 4326
 * - si los features de la capa no tienen campo nombre, el toma el que se le ingrese por parametros o el primero
 * @param layer layer en cual se basa para crear el archivo, debe tener almenos un feature
 * @param type tipo del archivo a crear, por defecto usa kml
 * @param proj codigo epsg (EPSG:XXXX) por defecto usa 4326
 * @param name nombre del archivo, por defecto usa misdatos
 * @param nName nombre del campo name en los atributos del feature
 * @param nDesc nombre del campo description en lso atributos del feature
 * @returns {boolean} indica si se pudo crear el archivo
 */
OpenLayersLoadFile.downloadFile4Layer=function(layer,type,proj,name,nName,nDesc){
    //console.info("downloadFile4Layer:layer.features.length",layer.features.length);
    if(layer && layer.features.length > 0){//TODO determinar que sea vectorial

        var format = type || "kml";

        name = name || "misdatos";


        var formatOut = OpenLayersLoadFile.Format[format] || OpenLayersLoadFile.Format['kml'];

        var curProj = OpenLayersLoadFile.Format.getProj(proj,formatOut);


        var olFormat = formatOut.formaOut(layer.map,curProj);
    console.info("olFormat",olFormat);
        var mime = formatOut.mimetype;

        var exten = formatOut.fileExt;

        var projNane = curProj.split(':')[1];

        OpenLayersLoadFile.Format.checkName(layer,nName,nDesc);

        var str = olFormat.write(layer.features, true);
        // not a good idea in general, just for this demo
        str = str.replace(/,/g, ', ');

        var fileName = name +"_"+projNane+ "." + exten;
        OpenLayersLoadFile.createDownloadFile(str, fileName,mime);

        return true;
    }
    return false;
};


/**
 * Objeto que se encaga de gestionar el formato de entrada de los features y que la peticion si sea valida para generar
 * el archivo correspondiente
 * @type {{checkName: checkName,
  *         getOutOptions: getOutOptions,
   *        getProj: getProj,
    *        kml: {proj: string[], mimetype: string, fileExt: string, formaOut: 'formaOut'},
     *       gml: {proj: string[], mimetype: string, fileExt: string, formaOut: 'formaOut'},
      *      gpx: {proj: string[], mimetype: string, fileExt: string, formaOut: 'formaOut'}}}
 */
OpenLayersLoadFile.Format = {
    /**
     * Verifica que los feactures del vector si tengan almenos el atributo con nombre name, tambien puede asignarle
     * el atributo que lo reemplazara
     * @param vector layer con los features a verificar
     * @param nName [optional] nombre del atributo que representa el name del feature
     * @param nDesc [optional] nombre del atributo que representa el descripcion del feature
     */
    checkName:function(vector,nName,nDesc){
        console.info("vector",vector);
        var features = vector.features;
        if(!features[0].attributes["name"]){
           console.error("no tiene campo name");
           var keys = Object.keys(features[0].attributes);
           console.info(keys);

           if(keys.length > 0){//si no tiene ningun atributo no hago nada
               var attName = null;
               var attDesc = null;
               if(nName !== null && features[0].attributes[nName]){// si nName no es null lo busco y si esta en atributos creo name con el
                   attName = nName;
               }else{//si nName es null cojo el primer atributo
                   attName = keys[0];
               }
               if(features[0].attributes["description"]){
                   attDesc = "description";
               }else if(nDesc !== null && features[0].attributes[nDesc]){//si nDesc no es null lo busco y si esta en los atributos creo description con el
                   attDesc = nDesc;
               }else if(keys.length > 1 && keys[1] !== attName){//si nName es null cojo el primer atributo
                   attDesc = keys[1];
               }
               var count = features.length;
               for (var i=0;i<count;i++) {
                   features[0].attributes.name = features[0].attributes[attName];
                   if (attDesc) {
                       features[0].attributes.description = features[0].attributes[attDesc];
                   }
               }



           }


        }
        if(!features[0].attributes["description"]){
            console.error("no tiene campo description");
        }
    },
    /**
     * crea las opciones de proyeccion para la creacion del formato
     * @param map
     * @param proj
     * @returns {{internalProjection: *, externalProjection: OpenLayers.Projection}}
     */
    getOutOptions: function (map, proj) {
        var internalProjection = map.baseLayer.projection;


        var out_options = {
            'internalProjection': internalProjection,
            'externalProjection': new OpenLayers.Projection(proj)
        };
        return out_options;
    },
    /**
     * verifica que la proyeccion del parametro sea valida sino entrega 4326
     * @param proj
     * @param formatOut
     * @returns {*|string}
     */
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