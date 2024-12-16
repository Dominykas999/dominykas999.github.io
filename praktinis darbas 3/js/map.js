//inicijuojamas žemėlapio objektas div map elemente
var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'styles/topo.json', // style URL
    hash: true,
    center: [23.1, 55.15], // starting position [lng, lat]
    zoom: 7 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());

//Basemap keitimo funkcija

function bmswitch(layername) {

    var layer;

    if (layername === 'Topografinis'){
        layer = 'styles/topo.json';
    } else if (layername === 'Šaltas'){
        layer = 'styles/cold_outdoors.json';
    } else {
        layer = 'styles/grays_apzvalginis.json';
    }

     // maplibre setStyle funkcija pakeičia žemėlapio stilių
    map.setStyle(layer);

     document.getElementById("flexSwitchCheckDefault1").checked = false;
     document.getElementById("flexSwitchCheckDefault2").checked = false;
     document.getElementById("flexSwitchCheckDefault3").checked = false;

     setTimeout(() => {
       loadLayers();
      }, "1000");
}
map.on("load", () => {
    console.log("Užkrovimas");
    loadLayers();
});

function loadLayers() {
    map.addSource("wms-qgis-landfill",{
        type: "raster",
        tiles:[
            "http://localhost/qgisserver/landfill_data?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=512&height=512&layers=landfill_data"
        ],
        tilesize: 512,
    });
    map.addSource("wms-qgis-vmsavkeliai",{
        type: "raster",
        tiles:[
            "http://localhost/qgisserver/vm_sav_keliai?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=512&height=512&layers=vm_sav_keliai"
        ],
        tilesize: 512,
    });
    map.addSource("wms-qgis-admsav",{
        type: "raster",
        tiles:[
            "http://localhost/qgisserver/gyv_sav_data?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=512&height=512&layers=lt_sav"
        ],
        tilesize: 512,
    });
    map.addLayer(
        {
            id:"wms-landfill",
            type: "raster",
            source: "wms-qgis-landfill",
            layout: {
                visibility: "none",
            }
        }
    );
    map.addLayer(
        {
            id:"wms-admsav",
            type: "raster",
            source: "wms-qgis-admsav",
            layout: {
                visibility: "none",
            }
        }
    );
    map.addLayer(
        {
            id:"wms-vmsavkeliai",
            type: "raster",
            source: "wms-qgis-vmsavkeliai",
            layout: {
                visibility: "none",
            }
        }
    );
}


function togglelayer(layerid){
    if(map.getLayoutProperty(layerid,"visibility")=="none"){
        map.setLayoutProperty(layerid, "visibility", "visible")
    }else{
        map.setLayoutProperty(layerid, "visibility", "none")
    }
    
}

map.addControl(
    new maplibreGLMeasures.default({
      lang: {
        areaMeasurementButtonTitle: "Matuoti plotą",
        lengthMeasurementButtonTitle: "Matuoti ilgį",
        clearMeasurementsButtonTitle: "Išvalyti matavimus",
      },
      units: "metric",
      unitsGroupingSeparator: " ",
      style: {
        text: {
          radialOffset: 0.9,
          letterSpacing: 0.05,
          color: "#198754",
          haloColor: "#fff",
          haloWidth: 0,
          font: "Noto Sans Regular",
        },
        common: {
          midPointRadius: 5,
          midPointColor: "#198754",
          midPointHaloRadius: 5,
          midPointHaloColor: "#FFF",
        },
        areaMeasurement: {
          fillColor: "#198754",
          fillOutlineColor: "#198754",
          fillOpacity: 0.1,
          lineWidth: 2,
        },
        lengthMeasurement: {
          lineWidth: 2,
          lineColor: "#198754",
        },
      },
    }),
    "bottom-left",
  );