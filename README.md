OpenLayerLoadKML
================

Modulo para la creacion y descarga de un archivo KML(y en otros formatos) mediante la serializacion que hace OpenaLayers

- Saca una excepcion cuando no tiene openlayers
- Solo permite la creacion del archivo si la capa vectorial tiene almenos un feature
- El normbre por defecto del es "misdatos" el cual colocara en caso de no ingresarle un nombre
- La cada formato tiene un epsg permitido, en caso de no agregarlo crea el archivo con "EPSG:4326"
- El nombre del archivo siempre lleva el numero del EPSG

Basado en:
- http://jsfiddle.net/roimergarcia/XLqsf/


Requerimientos
- OpenaLayers 2.13.1
- Jasmine 2.0.3

