var LatitudDefecto;
var LongitudDefecto;
var radioAccionHome;
var dentroRango = 0;
var tiendasPdvRecomendadas = [];
var ubicacionInicialUsuario = [];
var ubicacionMapStatic = [];
var map;
var trafficLayer;
var mapOptions;
var startPos;
var tituloUbicacionUsuario = "¡Encuentra tu Progresol!";
var marcadorUsuario = [];
var autocomplete;
var infowindowPe;
var selectedInfoWindow;
var selectedMarker;
var infowindowContent;
var place;
var circle;
var template;
var markerTiendaMap;
var infoWindow;
var p1;
var p2;
var nuevaTiendaPdvRecomendacion;

(function () {
    $("#locales").css("display", "none");

    $("#inputBuscaPorNombre").autocomplete({
        source: origenesAutocompletado,
        focus: function (event, ui) {
            $("#inputBuscaPorNombre").val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $("#inputBuscaPorNombre").val(ui.item.label);
            ConsultarProgresolesPorNombre(ui.item.label);
            return false;
        }
    });
})();

function initMap() {
    ubicacionMapStatic = { lat: parseFloat(LatitudDefecto), lng: parseFloat(LongitudDefecto) }

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(ubicacionMapStatic.lat, ubicacionMapStatic.lng),
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    marcadorUsuario = new google.maps.Marker({
        position: ubicacionMapStatic,
        title: tituloUbicacionUsuario,
        center: ubicacionMapStatic,
    });

    marcadorUsuario.setMap(map);

    //Agregar marcadores de todos los PDV (1.0 y 2.0) que sean tiendas
    InfoWindowsPdv(allTiendasPdv);

    //Autocomplete
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    //Instanciamos autocomplete
    autocomplete = new google.maps.places.Autocomplete((input),
        { componentRestrictions: { country: 'pe' } });
    PropiedadesAutocomplete(autocomplete);


    var marketPlaceFind = new google.maps.Marker({
        scaledSize: new google.maps.Size(15, 15)
    });

    var nuevaTiendaPdvRecomendacion;

    autocomplete.addListener('place_changed', function () {

        document.getElementById('cancelButton').classList.remove('d-none');
        document.getElementById('locales').classList.remove('d-none');

        marketPlaceFind.setVisible(false);
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            marketPlaceFind.setMap(map);
            return;
        }

        //GuardarBusqueda(place.geometry.location.lng(), place.geometry.location.lat());
        p1 = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

        LlenarListaProgresoles(p1, p2, nuevaTiendaPdvRecomendacion);

        //Si el lugar tiene una geometría, entonces preséntela en un mapa.
        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        } else {

            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }
        marketPlaceFind.setPosition(place.geometry.location);
        marketPlaceFind.setVisible(true);
        marketPlaceFind.setMap(map);
    });

    init();
}

function init() {
    if (!navigator.geolocation)
        alert('La geolocalización no es soportado por su navegador.');

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function geoSuccess(usuarioUbicacion) {

    marcadorUsuario.setVisible(false);

    var ubicacionMasCercanoATi = { lat: usuarioUbicacion.coords.latitude, lng: usuarioUbicacion.coords.longitude }
    MostrarTextoCercanosATi(true, ubicacionMasCercanoATi);

    startPos = usuarioUbicacion;

    ubicacionInicialUsuario = { lat: startPos.coords.latitude, lng: startPos.coords.longitude }

    //Mostrar mapa seteado
    mapOptions = {
        center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);
};

function geoError(error) {

    marcadorUsuario.setVisible(false);
    MostrarTextoCercanosATi(false, null);

    ubicacionInicialUsuario = { lat: parseFloat(LatitudDefecto), lng: parseFloat(LongitudDefecto) }

    //Mostrar mapa seteado
    mapOptions = {
        center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);
};

function autocompleteGM(ubicacionInicialUsuarioArray, tituloUbicacionUsuario) {

    //Instanciamos marker
    marcadorUsuario.setMap(null);
    marcadorUsuario = new google.maps.Marker({
        position: ubicacionInicialUsuarioArray,
        title: tituloUbicacionUsuario,
        center: ubicacionInicialUsuarioArray
    });

    circle = new google.maps.Circle({
        map: map,
        radius: 5000,
        fillColor: '#AA0000',
        strokeColor: '#053b70',
        strokeWeight: 1,
        opacity: 2
    });
    circle.bindTo('center', marcadorUsuario, 'position');

    //Agregar marcadores de todos los PDV (1.0 y 2.0) que sean tiendas
    InfoWindowsPdv(allTiendasPdv);

    marcadorUsuario.setMap(map);

    //Autocomplete
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    //Instanciamos autocomplete
    autocomplete = new google.maps.places.Autocomplete((input),
        { componentRestrictions: { country: 'pe' } });

    PropiedadesAutocomplete(autocomplete);

    marketPlaceFind = [];

    p1 = new google.maps.LatLng(ubicacionInicialUsuarioArray.lat, ubicacionInicialUsuarioArray.lng);
    LlenarListaProgresoles(p1, p2, nuevaTiendaPdvRecomendacion);

    autocomplete.addListener('place_changed', function () {

        document.getElementById('cancelButton').classList.remove('d-none');
        document.getElementById('locales').classList.remove('d-none');

        marcadorUsuario.setVisible(false);
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            //Mantener el marcador anterior al no encontrar resultados para que no salga vacío
            return;
        }

        p1 = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

        LlenarListaProgresoles(p1, p2, nuevaTiendaPdvRecomendacion);

        //Si el lugar tiene una geometría, entonces preséntela en un mapa.
        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        } else {

            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }
        marcadorUsuario.setPosition(place.geometry.location);
        marcadorUsuario.setVisible(true);
        marcadorUsuario.setMap(map);
    });
}

function GuardarBusqueda(longitud, latitud) {

    $("#divLoading").show();

    $.ajax({
        url: ProgresolBusquedaGuardar,
        type: 'Post',
        data: {
            'Buscar': $('#pac-input').val(),
            'longitud': longitud,
            'latitud': latitud
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                $("#divLoading").hide();
            }
            else {
                $("#divLoading").hide();
            }
        },
        error: function () {
            $("#divLoading").hide();
        }
    });
}

//Objeto TiendaPdvRecomendacion
function TiendaPdvRecomendacion(CodigoPDV, Direccion, HorarioAtencion, NombreComercial, pNombreComercialCorto, Celular, Latitud, Longitud, TipoProgresol, distanciaPs, Provincia, Distrito, HorariosAtencion) {
    this.CodigoPDV = CodigoPDV;
    this.Direccion = Direccion.substr(0, 28) + "...";
    this.HorarioAtencion = HorarioAtencion;
    this.NombreComercial = NombreComercial;
    this.NombreComercialCorto = pNombreComercialCorto;
    this.Celular = Celular;
    this.Latitud = Latitud;
    this.Longitud = Longitud;
    this.TipoProgresol = TipoProgresol;
    this.distanciaPs = distanciaPs;
    this.Provincia = Provincia;
    this.Distrito = Distrito;
    this.HorariosAtencion = HorariosAtencion;
}

//Calcular distancia entre 2 puntos en km's.
function calcDistance(p1, p2) {
    var valorKm = parseFloat((google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2));

    if (valorKm <= parseInt(radioAccionHome)) { dentroRango = 1; }
    else { dentroRango = 0; }
    return dentroRango;
}

//Propiedades Autocomplete
function PropiedadesAutocomplete(oAutocomplete) {
    //Enlazar la propiedad de los límites del mapa (ventana gráfica) al objeto autocompletado
    oAutocomplete.bindTo('bounds', map);

    //Establezca los campos de datos para regresar cuando el usuario seleccione un lugar.
    oAutocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
}

function LlenarListaProgresoles(p1, p2, nuevaTiendaPdvRecomendacion) {
    //Borrar objetos del array
    tiendasPdvRecomendadas = [];
    nuevaTiendaPdvRecomendacion = [];

    //Llenar puntos PDV's
    allTiendasPdv.forEach(camposPdv => {
        //Coordenadas pdv
        p2 = new google.maps.LatLng(camposPdv["Latitud"], camposPdv["Longitud"]);
        var flagRango = 0;
        var kmPtoUsuarioAPdv = 0;

        //Validar si está dentro del rango de acción para recomendación
        //No discrimina tipo progresol
        flagRango = calcDistance(p1, p2);

        kmPtoUsuarioAPdv = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);

        //Validar que los PDV se comporten como tienda y estén dentro del rango.
        if (flagRango == 1) {
            nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                camposPdv["CodigoPDV"],
                camposPdv["Direccion"],
                camposPdv["HorarioAtencion"],
                camposPdv["NombreComercial"],
                camposPdv["NombreComercialCorto"],
                camposPdv["CelularDueño"],
                camposPdv["Latitud"],
                camposPdv["Longitud"],
                camposPdv["TipoProgresol"],
                kmPtoUsuarioAPdv,
                camposPdv["Provincia"],
                camposPdv["Distrito"],
                camposPdv["HorariosAtencion"]
            );
            tiendasPdvRecomendadas.push(nuevaTiendaPdvRecomendacion);
        }
    });

    //Ordenar de forma ascendente por: distanciaPs
    tiendasPdvRecomendadas.sort(function (a, b) {
        return (a.distanciaPs - b.distanciaPs);
    })

    LlenarRecomendacionesLeftDivHome(tiendasPdvRecomendadas);
}

function InfoWindowsPdv(oListPdv) {
    //Crear marcadores
    infoWindow = new google.maps.InfoWindow({
        position: map.getCenter()
    });
    for (var i = 0; i < oListPdv.length; i++) {
        var data = oListPdv[i];
        var myLatlng = new google.maps.LatLng(data.Latitud, data.Longitud);

        var icon = {
            url: "/Content/assets/img/icon-marker-ps.png", // url
            scaledSize: new google.maps.Size(25, 30),
            Origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
        };

        var markerPdv = new google.maps.Marker({
            position: myLatlng,
            //map: map,
            title: data.vnombre,
            icon: icon,
            scaledSize: new google.maps.Size(15, 15)
        });

        markerPdv.setMap(map);

        google.maps.event.addListener(infoWindow, 'domready', function () {
            var iwOuter = $('.gm-style-iw');
            iwOuter.css({ width: '355px' });
            iwOuter.css({ height: '225px' });
        });

        //Adjuntar evento click al marcador
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                //Diseño de infoWindow
                var resultInfoTienda = CuadroOpcionesTienda(data.NombreComercial, data.NombreComercialCorto, data.Direccion, data.HorarioAtencion, data.CodigoPDV, data.CelularDueño, data.Provincia, data.Distrito, data.distanciaPs, data.HorariosAtencion, "InfoMapa");

                infoWindow.setContent(resultInfoTienda);

                infoWindow.open(map, marker);
            });
        })(markerPdv, data);
    }
}

function LlenarRecomendacionesLeftDivHome(arrayListTienda) {
    $("#locales").html("");

    if (arrayListTienda.length == 0) {
        template = `
            <div class="ep-2-item p-4 d-flex flex-column">
            <p class="ep-2-item__name" style="color:#053b70!important;">Esperamos ingresar pronto a tu ciudad.</p>
            <div class="d-flex align-items-center mb-2">
                <div class="ep-2-item__horary">
                <p>Por ahora puedes realizar una nueva búsqueda introduciendo otra ubicación.</p>
                </div>
            </div>  
            </div>
        `;

        $("#locales").append(template);
    }
    else {
        arrayListTienda.forEach(e => {
            var resultCuadroTienda = CuadroOpcionesTienda(e.NombreComercial, e.NombreComercialCorto, e.Direccion, e.HorarioAtencion, e.CodigoPDV, e.Celular, e.Provincia, e.Distrito, e.distanciaPs, e.HorariosAtencion, "ResultadoBusqueda");

            $("#locales").append(resultCuadroTienda);
        });
    }
}

function HacerPedidoWhatsApp(CodigoLocal, Celular) {
    gtag('event', CodigoLocal, {
        'event_category': 'Clicks_Cotizar'
    });

    window.open(UrlApiWa + Celular + "&text=" + "¡Hola! te encontré en la web de Progresol, quiero solicitar una cotización de materiales de construcción");
}

function CuadroOpcionesTienda(_NombreComercial, pNombreComercialCorto, _Direccion, _HorarioAtencion, _CodigoPdv, _Cel, _Provincia, _Distrito, _DistanciaPs, _horarios, _tipoTemplate) {
    var htmlWa = "";
    var htmlVerMas = "";

    //Validar valor vacío, indefinido o null del campo celular dueño
    if (typeof _Cel === 'undefined' || _Cel == '' || _Cel == null) {
        htmlWa = "";
    }
    else {
        if (_tipoTemplate == "InfoMapa") {
            htmlWa = `
                    <button onclick="HacerPedidoWhatsApp('${_CodigoPdv}', '${_Cel}')" class="btnHacerpedido" >
                        <div class="icon-whatsapp"></div>
                        &nbsp;Cotizar
                    </button >`;
        }
        else if (_tipoTemplate == "ResultadoBusqueda") {
            htmlWa = `
                    <button onclick="HacerPedidoWhatsApp('${_CodigoPdv}', '${_Cel}')" class="ep-2-item__c2a-2" >
                        <div class="icon-whatsapp"></div>
                        &nbsp;Cotizar
                    </button >`;
        }
    }

    //Validar valor vacío, indefinido o null del campo horario atención
    if (typeof _HorarioAtencion === 'undefined' || _HorarioAtencion == '' || _HorarioAtencion == null) {
        _HorarioAtencion = "-";
    }

    if (_tipoTemplate == "InfoMapa") {
        template = `
            <div class="ep-2-item p-3 d-flex flex-column">
            <p class="font-weight-bold" style="margin-bottom: 0.3rem;">${_NombreComercial}</p>
            <div class="d-flex mb-2">
              <div class="icon-marker mr-2"></div>
              <div class="d-flex flex-column">
                <p class="m-0">${_Direccion}</p> 
                <p class="m-0" style="color:#063b70;font-weight: bold;font-size:11px;">${_Provincia}, ${_Distrito}</p>
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="icon-watch mr-2"></div>
              <div style="overflow-y: auto;height: 32px;width: 200px;background-color: #00b50024;border-radius: 5px;padding: 1px;">
                ${_HorarioAtencion}
              </div>
            </div>
            <div class="d-flex justify-content-center row pt-0 align-content-center">
              <button onclick="AbrirTiendaProgresol('${_CodigoPdv}','${pNombreComercialCorto}')" class="btnVermas">Ver m&aacute;s</button>
            </div>
            <div class="d-flex justify-content-center row pt-0 align-content-center" style="margin-top: 3px;">
              ${htmlWa}
            </div>
        </div>
            `;
    }
    else if (_tipoTemplate == "ResultadoBusqueda") {
        template = `
              <div onclick="CentrarMarcadorConInfoWindows('${_CodigoPdv}')" class="ep-2-item p-4 d-flex flex-column">
                <p class="ep-2-item__name">${_NombreComercial}</p>
                <div class="d-flex align-items-center mb-2">
                  <div class="icon-marker"></div>
                  <div class="ep-2-item__address ml-3">
                    <p>${_Direccion}</p>
                    <p >A <strong>${_DistanciaPs}</strong> kilómetros de tu ubicación.</p>
                    <p class="m-0" style="color:#063b70;font-weight: bold;font-size:11px;">${_Provincia}, ${_Distrito}</p>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <div class="icon-watch"></div>
                  <div class="ep-2-item__horary ml-2" style="margin-left: 0.9rem!important;background-color: #00b50024;border-radius: 8px;padding: 10px;">
                    <p>${_HorarioAtencion}</p>
                  </div>
                </div>
                <div class="d-flex flex-row ep-2-item__c2a justify-content-between align-content-center">
                  <button onclick="AbrirTiendaProgresol('${_CodigoPdv}','${pNombreComercialCorto}')" class="ep-2-item__c2a-1">Ver m&aacute;s</button>
                  ${htmlWa}
                </div>
              </div>
            `;
    }
    return template;
}

function AbrirTiendaProgresol(CodigoLocal, pNombreComercialCorto) {
    gtag('event', CodigoLocal, {
        'event_category': 'Clicks_VerMas'
    });

    var nombreComercialCorto = "";
    if (pNombreComercialCorto === undefined
        || pNombreComercialCorto.trim().length === 0
        || pNombreComercialCorto === "null") {
        nombreComercialCorto = "PROGRESOL"; //Valor por Defecto
    }
    else {
        nombreComercialCorto = pNombreComercialCorto;
    }

    //var uriTiendaMiProgresol = "/socio/progresol" + '/' + nombreComercialCorto;
    var uriTiendaMiProgresol = TiendaMiProgresol + '/' + nombreComercialCorto;

    $("#divLoading").show();
    $.ajax({
        url: TiendaProgresol,
        type: 'Post',
        data: {
            "Codigo": CodigoLocal
        },
        async: true,
        cache: false,
        success: function (data) {
            $("#divLoading").hide();
            if (data.CodigoRespuesta == 1) {
                window.open(uriTiendaMiProgresol, '_blank');
            }
            else {
                $("#ver_mas").fadeTo(5000, 500).slideUp(500, function () {
                    $("#ver_mas").slideUp(500);
                });
            }
        },
        error: function () {
            $("#divLoading").hide();
        }
    });
}

function CentrarMarcadorConInfoWindows(CodSapTiendaPS) {

    infoWindow = new google.maps.InfoWindow();
    markerTiendaMap = [];
    var icon = {
        url: "/Content/assets/img/icon-marker-ps.png",
        scaledSize: new google.maps.Size(25, 30),
        Origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    tiendasPdvRecomendadas.forEach(tiendaSeleccionada => {
        var myLatlng = new google.maps.LatLng(tiendaSeleccionada.Latitud, tiendaSeleccionada.Longitud);

        if (tiendaSeleccionada.CodigoPDV == CodSapTiendaPS) {
            markerTiendaMap = new google.maps.Marker({
                position: myLatlng,
                icon: icon
            });

            map.setCenter(markerTiendaMap.getPosition());

            google.maps.event.addListener(infoWindow, 'domready', function () {
                var iwOuter = $('.gm-style-iw');
                iwOuter.css({ width: '355px' });
                iwOuter.css({ height: '225px' });
            });

            if (selectedInfoWindow != null && selectedInfoWindow.getMap() != null) {
                selectedInfoWindow.close();
                if (selectedInfoWindow == infoWindow) {
                    selectedInfoWindow = null;
                    return;
                }
            }

            var resultInfoTienda = CuadroOpcionesTienda(tiendaSeleccionada.NombreComercial, tiendaSeleccionada.NombreComercialCorto, tiendaSeleccionada.Direccion, tiendaSeleccionada.HorarioAtencion, tiendaSeleccionada.CodigoPDV, tiendaSeleccionada.Celular, tiendaSeleccionada.Provincia, tiendaSeleccionada.Distrito, tiendaSeleccionada.kmPtoUsuarioAPdv, tiendaSeleccionada.HorariosAtencion, "InfoMapa");
            infoWindow.setContent("<div class='finder d-flex flex-column justify-content-start row pt-4'>" +
                "<div class='ep-2-list'>" +
                "<div class='w-100 d-flex flex-column'>" +
                resultInfoTienda +
                "</div></div></div>");

            selectedInfoWindow = infoWindow;
            selectedInfoWindow.open(map, markerTiendaMap);

            google.maps.event.addListener(markerTiendaMap, "click", function (e) {
                infoWindow.setContent("<div class='finder d-flex flex-column justify-content-start row pt-4'>" +
                    "<div class='ep-2-list'>" +
                    "<div class='w-100 d-flex flex-column'>" +
                    resultInfoTienda +
                    "</div></div></div>");

                infoWindow.open(map, markerTiendaMap);
            });
            markerTiendaMap.setMap(map);
        }
    });
}

function MostrarTextoCercanosATi(EnabledCoordenadas, coord) {
    var result = document.getElementById("div-progresol-cerca-a-ti");
    var node;

    if (!EnabledCoordenadas) {
        node = `<p class="m-0 py-2" style="font-size: 0.9em;">Busca el más cercano a ti.</p>`;
    } else {
        node = `<p class="m-0 py-2" style="font-size: 0.9em;">Busca el <a onclick="MasCercanoATi('${coord.lat}', '${coord.lng}')" style="color: #00b500;cursor:pointer;">más cercano a ti.</a></p>`;
    }

    result.innerHTML = node;
}

function MasCercanoATi(latitud, longitud) {
    InicializarBusquedaPorUbicacion();

    var ubicacionInicialUsuario = new google.maps.LatLng(latitud, longitud);

    marcadorUsuario.setMap(null);
    marcadorUsuario = [];

    marcadorUsuario = new google.maps.Marker({
        zoom: 12,
        position: ubicacionInicialUsuario,
        center: ubicacionInicialUsuario
    });

    circle.bindTo('center', marcadorUsuario, 'position');

    map.setCenter(marcadorUsuario.getPosition());
    marcadorUsuario.setMap(map);

    LlenarListaProgresoles(ubicacionInicialUsuario, p2, nuevaTiendaPdvRecomendacion);
}

//Busqueda por nombre
function ConsultarProgresolesPorNombre(pTextoBusqueda) {
    var tiendasProgresolPorNombre = [];
    var card = document.getElementById('pac-card');
    var p1;

    tiendasProgresolPorNombre = Enumerable.From(allTiendasPdv)
        //.Where("!!$.NombreComercial.match(/^" + pTextoBusqueda + "/i)")
        .Where("~($.NombreComercial).toUpperCase().indexOf('" + pTextoBusqueda + "'.toUpperCase())")
        .OrderBy("$.NombreComercial")
        .ToArray();

    ubicacionMapStatic = { lat: parseFloat(tiendasProgresolPorNombre[0].Latitud), lng: parseFloat(tiendasProgresolPorNombre[0].Longitud) }
    p1 = new google.maps.LatLng(ubicacionMapStatic.lat, ubicacionMapStatic.lng);

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(ubicacionMapStatic.lat, ubicacionMapStatic.lng),
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    marcadorUsuario = new google.maps.Marker({
        position: ubicacionMapStatic,
        title: tituloUbicacionUsuario,
        center: ubicacionMapStatic,
    });
    marcadorUsuario.setMap(map);

    //Agregar marcadores de todos los PDV (1.0 y 2.0) que sean tiendas
    InfoWindowsPdv(tiendasProgresolPorNombre);

    //Autocomplete
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    document.getElementById('btnBorrarTextoBuscaPorNombre').classList.remove('d-none');
    document.getElementById('locales').classList.remove('d-none');

    MostrarProgresolesPorNombre(p1, tiendasProgresolPorNombre);

    $(".ep-2-item:first").css({ 'background-color': '#e8edef' });
}

function MostrarProgresolesPorNombre(p1, pTiendasPorNombreEncontrados) {
    //Borrar objetos del array
    var p2;
    tiendasPdvRecomendadas = [];
    var tiendaProgresolRecomendada = {};

    //Llenar puntos PDV's
    pTiendasPorNombreEncontrados.forEach(camposPdv => {
        //Coordenadas pdv
        p2 = new google.maps.LatLng(camposPdv["Latitud"], camposPdv["Longitud"]);
        var kmPtoUsuarioAPdv = 0;

        kmPtoUsuarioAPdv = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);

        tiendaProgresolRecomendada = new TiendaPdvRecomendacion(
            camposPdv["CodigoPDV"],
            camposPdv["Direccion"],
            camposPdv["HorarioAtencion"],
            camposPdv["NombreComercial"],
            camposPdv["NombreComercialCorto"],
            camposPdv["CelularDueño"],
            camposPdv["Latitud"],
            camposPdv["Longitud"],
            camposPdv["TipoProgresol"],
            kmPtoUsuarioAPdv,
            camposPdv["Provincia"],
            camposPdv["Distrito"],
            camposPdv["HorariosAtencion"]
        );

        tiendasPdvRecomendadas.push(tiendaProgresolRecomendada);
    });

    //Ordenar de forma ascendente por: distanciaPs
    tiendasPdvRecomendadas.sort(function (a, b) {
        return (a.distanciaPs - b.distanciaPs);
    })

    LlenarRecomendacionesLeftDivHome(tiendasPdvRecomendadas);
}

function InicializarBusquedaPorUbicacion() {
    ubicacionMapStatic = { lat: parseFloat(LatitudDefecto), lng: parseFloat(LongitudDefecto) }

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(ubicacionMapStatic.lat, ubicacionMapStatic.lng),
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    marcadorUsuario = new google.maps.Marker({
        position: ubicacionMapStatic,
        title: tituloUbicacionUsuario,
        center: ubicacionMapStatic,
    });

    marcadorUsuario.setMap(map);

    //Agregar marcadores de todos los PDV (1.0 y 2.0) que sean tiendas
    InfoWindowsPdv(allTiendasPdv);

    //Autocomplete
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    //Instanciamos autocomplete
    autocomplete = new google.maps.places.Autocomplete((input),
        { componentRestrictions: { country: 'pe' } });
    PropiedadesAutocomplete(autocomplete);


    var marketPlaceFind = new google.maps.Marker({
        scaledSize: new google.maps.Size(15, 15)
    });

    var p1;
    var p2;
    var nuevaTiendaPdvRecomendacion;

    autocomplete.addListener('place_changed', function () {

        document.getElementById('cancelButton').classList.remove('d-none');
        document.getElementById('locales').classList.remove('d-none');

        marketPlaceFind.setVisible(false);
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            marketPlaceFind.setMap(map);
            return;
        }

        p1 = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

        LlenarListaProgresoles(p1, p2, nuevaTiendaPdvRecomendacion);

        //Si el lugar tiene una geometría, entonces preséntela en un mapa.
        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        } else {

            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }
        marketPlaceFind.setPosition(place.geometry.location);
        marketPlaceFind.setVisible(true);
        marketPlaceFind.setMap(map);
    });

    init();
}

function OcultarInfoWindowsPer() {
    const divinforwindows_per = document.getElementById('div-infowindowsmap');
    divinforwindows_per.classList.add('d-none');
}