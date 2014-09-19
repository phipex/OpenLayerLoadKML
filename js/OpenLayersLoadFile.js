/**
 * Created by @phipex on 19/09/2014.
 */
var OpenLayersLoadFile = {};

/**
 * Verifica si el navegador es compatible con los metodos para
 * crear archivos
 * @returns {boolean} true: si es compatible o false en el caso contrario
 */
var ollfIsCompatible = function(){
    return true;
};
OpenLayersLoadFile.prototype.IsCompatible=ollfIsCompatible;

//TODO lista de posibles valores a exportar
//TODO funcion que guarda el contenido del archivo en una funcion generica
//TODO verica que tenga compatibilidad para guardar archivos
//TODO funcion que guarda los archivos