function RegistrarRedProgresol() {

    var isCheckedTyC = document.getElementById('accept_terms').checked;
    if (!isCheckedTyC) {
        $("#success-alert3").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert3").slideUp(500);
        });
        return false;
    }

    if ($("#form-ser-progresol")[0].reportValidity()) {
        $("#divLoading").show();

        $.ajax({
            url: RegistrarRedProgresolControlador,
            type: 'Post',
            data: {
                'nombre': $('#txtnombre').val(),
                'telefono': $('#txttelefono').val(),
                'email': $('#txtemail').val(),
                'comentario': $('#txtuser-comment').val()
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.CodigoRespuesta == 1) {
                    $("#divLoading").hide();
                    showFerreteriaRegistrada();
                    $('#txtnombre').val("");
                    $('#txttelefono').val("");
                    $('#txtemail').val("");
                    $('#txtuser-comment').val("");
                    $("#accept_terms").removeAttr("checked");
                }
                else {
                    $("#divLoading").hide();
                    alert(data.Mensaje);
                }
            },
            error: function () {
                $("#divLoading").hide();
            }
        });
    }
}

function RegistrarOpinionClienteProgresol() {

    $("#divLoading").show();

    var numeroPuntiacion = parseInt(numeroPuntajeSeleccionado.charAt(numeroPuntajeSeleccionado.length - 1));
    $.ajax({
        url: RegistrarOpinionClienteProgresolControlador,
        type: 'Post',
        data: {
            'DetalleOpinion': $('#txtaDetalleOpinion').val(),
            'NumeroPuntuacion': numeroPuntiacion,
            'FechaOpinion': new Date().toLocaleString()
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                $("#divLoading").hide();
                
                $('#txtaDetalleOpinion').val("");
                //$("#accept_terms").removeAttr("checked");
            }
            else {
                $("#divLoading").hide();
                alert(data.Mensaje);
            }
        },
        error: function () {
            $("#divLoading").hide();
        }
    });
}