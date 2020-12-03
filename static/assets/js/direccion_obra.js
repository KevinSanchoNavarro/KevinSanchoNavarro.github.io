var LatitudDefecto;
var LongitudDefecto;
var radioAccion;
var geocoder;
var dentroRango = 0;
var tiendasPdvRadioAccion = [];
var tiendasPdvRecomendadas = [];
var allTiendasPdv = []
var ubicacionInicialUsuario = [];
var map;
var mapOptions;
var startPos;
var tituloUbicacionUsuario = "¡Encuentra tu obra!";
var marcadorUsuario;
var autocomplete;



function initMap() {

    if (!navigator.geolocation) {
        alert('La geolocalización no es soportado por su navegador.');
    }
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function geoSuccess(usuarioUbicacion) {
    startPos = usuarioUbicacion;



    ubicacionInicialUsuario = { lat: startPos.coords.latitude, lng: startPos.coords.longitude }




    $("#divLoading").show();
    $.ajax({
        url: RecuperarMapaDatosObra,
        type: 'Post',
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                ubicacionInicialUsuario = { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) }

                //Mostrar mapa seteado
                mapOptions = {
                    center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
                    disableDefaultUI: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoom: 18,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("agrega-direccion-map"), mapOptions);

                autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);
                Recomendaciones(parseFloat(data.latitud), parseFloat(data.longitud));
                $("#divLoading").hide();
            }
            else {

                //Mostrar mapa seteado
                mapOptions = {
                    center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
                    disableDefaultUI: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("agrega-direccion-map"), mapOptions);

                autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);

                $("#divLoading").hide();

            }
        },
        error: function () {
            $("#divLoading").hide();
        }
    });


};

function geoError(error) {
    ubicacionInicialUsuario = { lat: parseFloat(LatitudDefecto), lng: parseFloat(LongitudDefecto) }

    $("#divLoading").show();
    $.ajax({
        url: RecuperarMapaDatosObra,
        type: 'Post',
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                ubicacionInicialUsuario = { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) }

                //Mostrar mapa seteado
                mapOptions = {
                    center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
                    disableDefaultUI: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoom: 18,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("agrega-direccion-map"), mapOptions);

                autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);
                Recomendaciones(parseFloat(data.latitud), parseFloat(data.longitud));
                $("#divLoading").hide();
            }
            else {

                //Mostrar mapa seteado
                mapOptions = {
                    center: new google.maps.LatLng(ubicacionInicialUsuario.lat, ubicacionInicialUsuario.lng),
                    disableDefaultUI: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("agrega-direccion-map"), mapOptions);

                autocompleteGM(ubicacionInicialUsuario, tituloUbicacionUsuario);

                $("#divLoading").hide();

            }
        },
        error: function () {
            $("#divLoading").hide();
        }
    });



};

function Recomendaciones(latitud,longitud) {
    //Capturar
    //var p1 = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
    var p1 = new google.maps.LatLng(latitud, longitud);
    var p2;
    var flagRango = 0;
    var kmObraAPdv = 0;
    var nuevaTiendaPdvRecomendacion;

    //Llenar variables Latitud y Longitud para que sean registradas en SQL
    LatitudObraEncontrada = latitud;
    LongitudObraEncontrada = longitud;

    console.log(LatitudObraEncontrada + " " + LongitudObraEncontrada);
    GuardarBusquedaObra(LongitudObraEncontrada, LatitudObraEncontrada);
    //Borrar objetos del array
    tiendasPdvRadioAccion = [];
    tiendasPdvRecomendadas = [];

    //Llenar recomendaciones puntos PDV's
    allTiendasPdv.forEach(camposPdv => {
        //Coordenadas pdv
        p2 = new google.maps.LatLng(camposPdv["Latitud"], camposPdv["Longitud"]);

        //Validar si está dentro del rango de acción para recomendación
        //No discrimina tipo progresol
        flagRango = calcDistance(p1, p2);

        kmObraAPdv = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);

        //Validar que los PDV se comporten como tienda y estén dentro del rango.
        if (camposPdv["FlagTienda"] == "X" && flagRango == 1) {
            nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                camposPdv["CodigoPDV"],
                camposPdv["NombreComercial"],
                camposPdv["CelularDueño"],
                camposPdv["Latitud"],
                camposPdv["Longitud"],
                camposPdv["TipoProgresol"],
                kmObraAPdv);

            tiendasPdvRadioAccion.push(nuevaTiendaPdvRecomendacion);
        }
    });
    console.log("PDV dentro del rango");
    console.log(tiendasPdvRadioAccion);

    //Contabilizar PS Pdv 1.0 y 2.0
    var contPsPdvV1 = 0;
    var contPsPdvV2 = 0;

    tiendasPdvRadioAccion.forEach(camposPdv => {
        if (camposPdv["TipoProgresol"] == "Progresol 1.0") { contPsPdvV1++; }
        if (camposPdv["TipoProgresol"] == "Progresol 2.0") { contPsPdvV2++; }
    });

    //Progresoles recomendados
    //1. Caso: Cantidad PS2.0 >= 3
    //Nota: Recomendar los 3 más cercanos
    if (contPsPdvV2 >= 3) {
        if (contPsPdvV1 >= 0) {
            //Insertar solo los PS 2.0 en el vector final
            tiendasPdvRadioAccion.forEach(camposPdv => {
                if (camposPdv["TipoProgresol"] == "Progresol 2.0") {
                    nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                        camposPdv["CodigoPDV"],
                        camposPdv["NombreComercial"],
                        camposPdv["CelularDueño"],
                        camposPdv["Latitud"],
                        camposPdv["Longitud"],
                        camposPdv["TipoProgresol"],
                        camposPdv["distanciaObraPs"]);

                    tiendasPdvRecomendadas.push(nuevaTiendaPdvRecomendacion);
                }
            });
        }

        //Ordenar de forma ascendente por: kmObraAPdv
        tiendasPdvRecomendadas.sort(function (a, b) {
            return (a.distanciaObraPs - b.distanciaObraPs);
        })
        //Borrar objetos indíce 3 en adelante
        tiendasPdvRecomendadas.splice(3, tiendasPdvRecomendadas.length)
    }
    //2. Caso: Cantidad PS2.0 = 0
    //Nota: Recomendar PS1.0, de 1 a 3, por proximidad y según rango establecido
    if (contPsPdvV2 == 0) {
        if (contPsPdvV1 > 0) {
            //Insertar solo los PS 1.0, dado que no hay PS2.0 en el rango
            tiendasPdvRadioAccion.forEach(camposPdv => {
                nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                    camposPdv["CodigoPDV"],
                    camposPdv["NombreComercial"],
                    camposPdv["CelularDueño"],
                    camposPdv["Latitud"],
                    camposPdv["Longitud"],
                    camposPdv["TipoProgresol"],
                    camposPdv["distanciaObraPs"]);

                tiendasPdvRecomendadas.push(nuevaTiendaPdvRecomendacion);
            });

            //Ordenar de forma ascendente por: kmObraAPdv
            tiendasPdvRecomendadas.sort(function (a, b) {
                return (a.distanciaObraPs - b.distanciaObraPs);
            })

            //Borrar objetos indíce 3 en adelante
            tiendasPdvRecomendadas.splice(3, tiendasPdvRecomendadas.length)
        }
    }

    //3. Caso: Cantidad de PS2.0 => {1 ó 2}
    //Nota: Completar con PS1.0 si existe y que sean los más próximos.
    if (contPsPdvV2 > 0 && contPsPdvV2 < 3) {

        tiendasPdvRadioAccion.forEach(camposPdv => {
            if (camposPdv["TipoProgresol"] == "Progresol 1.0") {
                nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                    camposPdv["CodigoPDV"],
                    camposPdv["NombreComercial"],
                    camposPdv["CelularDueño"],
                    camposPdv["Latitud"],
                    camposPdv["Longitud"],
                    camposPdv["TipoProgresol"],
                    camposPdv["distanciaObraPs"]);

                tiendasPdvRecomendadas.push(nuevaTiendaPdvRecomendacion);
            }
        });

        //Ordenar de forma ascendente por: kmObraAPdv
        tiendasPdvRecomendadas.sort(function (a, b) {
            return (a.distanciaObraPs - b.distanciaObraPs);
        })

        //Borrar objetos indíce 2 en adelante
        tiendasPdvRecomendadas.splice(2, tiendasPdvRecomendadas.length)
        tiendasPdvRecomendadas.reverse();

        //Insertar los PS2.0 existentes (1 ó 2)
        tiendasPdvRadioAccion.forEach(camposPdv => {
            if (camposPdv["TipoProgresol"] == "Progresol 2.0") {
                nuevaTiendaPdvRecomendacion = new TiendaPdvRecomendacion(
                    camposPdv["CodigoPDV"],
                    camposPdv["NombreComercial"],
                    camposPdv["CelularDueño"],
                    camposPdv["Latitud"],
                    camposPdv["Longitud"],
                    camposPdv["TipoProgresol"],
                    camposPdv["distanciaObraPs"]);

                tiendasPdvRecomendadas.push(nuevaTiendaPdvRecomendacion);
            }
        });

        //Ordenar de forma descendente por: tipoPs
        tiendasPdvRecomendadas.reverse();

        //Borrar objetos indíce 3 en adelante
        tiendasPdvRecomendadas.splice(3, tiendasPdvRecomendadas.length)
    }

    console.log("PDV Recomendados");
    console.log(tiendasPdvRecomendadas);

    tiendasRecomendadas = tiendasPdvRecomendadas;
    console.log(tiendasRecomendadas);
}

function autocompleteGM(ubicacionInicialUsuarioArray, tituloUbicacionUsuario) {
    //Instanciamos marker
    marcadorUsuario = new google.maps.Marker({
        position: ubicacionInicialUsuarioArray,
        title: tituloUbicacionUsuario,
        draggable: true,
        center: ubicacionInicialUsuarioArray
    });

    //Instanciamos geocoder
    geocoder = new google.maps.Geocoder();

    //Geocodifica coordenadas obra
    GeocodeDireccionObra(geocoder, marcadorUsuario);

    marcadorUsuario.setMap(map);

    //Autocomplete
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    //Instanciamos autocomplete
    autocomplete = new google.maps.places.Autocomplete((input),
        { componentRestrictions: { country: 'pe' } });

    PropiedadesAutocomplete(autocomplete);

    //Capturar coordenas obra
    marcadorUsuario.addListener('dragend', function (event) {
        Recomendaciones(this.getPosition().lat(), this.getPosition().lng());
    });

    autocomplete.addListener('place_changed', function () {
        marcadorUsuario.setVisible(false);
        var place = autocomplete.getPlace();
        console.log(place);
        
        if (!place.geometry) {
            //El usuario ingresó el nombre de un Lugar que no fue sugerido y presionó la tecla Intro,
            //o la solicitud de Detalles del Lugar falló.
            //window.alert("No hay resultados disponibles para: '" + place.name + "'");
            $("#input_direccion_obra").val("");
            return;
        }

        //var val = place.address_components[0]['long_name'] + ', ' + place.address_components[1]['long_name'];

        $("#input_direccion_obra").val($("#pac-input").val());

        //document.getElementById("input_direccion_obra").value = val;//"";
        Recomendaciones(place.geometry.location.lat(), place.geometry.location.lng());
        GuardarBusquedaObra(place.geometry.location.lng(), place.geometry.location.lat());

        //Si el lugar tiene una geometría, entonces preséntela en un mapa.
        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);
            map.setCenter(place.geometry.location);
            map.setZoom(16);
        } else {

            map.setCenter(place.geometry.location);
            map.setZoom(14);
        }
        marcadorUsuario.setPosition(place.geometry.location);
        marcadorUsuario.setVisible(true);
    });
}



function GuardarBusquedaObra(longitud, latitud) {

    $("#divLoading").show();

    $.ajax({
        url: RecuperarObraSelec,
        type: 'Post',
        data: {
            'Buscar': $('#input_direccion_obra').val(),
            'longitud': longitud,
            'latitud': latitud
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                //p1 = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
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
function TiendaPdvRecomendacion(CodigoPDV, NombreComercial, Celular, Latitud, Longitud, TipoProgresol, distanciaObraPs) {
    this.CodigoPDV = CodigoPDV;
    this.NombreComercial = NombreComercial;
    this.Celular = Celular;
    this.Latitud = Latitud;
    this.Longitud = Longitud;
    this.TipoProgresol = TipoProgresol;
    this.distanciaObraPs = distanciaObraPs;
}

//Calcular distancia entre 2 puntos en km's.
function calcDistance(p1, p2) {
    var valorKm = parseFloat((google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2));

    if (valorKm <= parseInt(radioAccion)) { dentroRango = 1; }
    else { dentroRango = 0; }
    return dentroRango;
}

//Geocodificar dirección obra a partir de sus coordenadas
function GeocodeDireccionObra(oGeodecoder, marcadorUsuario) {
    google.maps.event.addListener(marcadorUsuario, 'dragend', function () {
        oGeodecoder.geocode({ 'latLng': marcadorUsuario.getPosition() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var address = results[0]['formatted_address'];
                $("#input_direccion_obra").val(address);
                $("#pac-input").val("");
            }
        });
    });
}

//Propiedades Autocomplete
function PropiedadesAutocomplete(oAutocomplete) {
    //Enlazar la propiedad de los límites del mapa (ventana gráfica) al objeto autocompletado
    oAutocomplete.bindTo('bounds', map);

    //Establezca los campos de datos para regresar cuando el usuario seleccione un lugar.
    oAutocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
}