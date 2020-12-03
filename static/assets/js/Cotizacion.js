function ProcesoCotizacion() {
    $("#divLoading").show();
    console.log(ProcesoCotizacionEjecutar);
    $.ajax({
        url: ProcesoCotizacionEjecutar,
        type: 'Post',
        data: {
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                document.getElementById('pedido-enviado').classList.toggle('d-none');
                ResumenPedido();
                $("#divLoading").hide();
                //alert('guardado correctamente.')
                //window.location.href = SeleccioneProducto;

            }
            if (data.CodigoRespuesta == 2) {
//                alert("El Pedido ya fue Enviado.")
                window.location.href = EncuentraProgresolBusqueda;//"/Main/EncuentraProgresol";
            }
            if (data.CodigoRespuesta == 0) {
                $("#divLoading").hide();
                alert("Error: " + data.Mensaje);
            }
            else {
                $("#divLoading").hide();
               // alert(data.Mensaje);
            }
        },
        error: function () {
            $("#divLoading").hide();
            // alertModal("Se produjo un error al obtener los datos.");
        }
    });
}

function ResumenPedido() {
        $("#divLoading").show();
        
        $.ajax({
            url: EmitirPedidoResumen,
            type: 'Get',
            data: {
            },
            async: true,
            cache: false,
            success: function (data) {
                //$('html, body').animate({
                //    scrollTop: 10
                //}, 1000);
                $("#pedido-enviado").html(data);
                $("#divLoading").hide();
            },
            error: function () {
                $("#divLoading").hide();
                // alertModal("Se produjo un error al obtener los datos.");
            }
        });
}
function EnviarWasap(CodigoLocal, numeroWasap) {
    gtag('event', CodigoLocal, {
        'event_category': 'Clicks_Cotizar'
    });

    let mensaje = '¡Hola! te encontré en la web de Progresol, quiero solicitar una cotización de materiales de construcción';
    window.open("https://api.whatsapp.com/send?phone=" + numeroWasap +"&text=" + encodeURIComponent(mensaje));
}


