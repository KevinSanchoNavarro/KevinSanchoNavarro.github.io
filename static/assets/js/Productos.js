(function () {

    document.querySelectorAll(".seleccionar-productos .inp-cbx").forEach(checkbox => {
        checkbox.addEventListener("click", function () {
            var contador = this.id.split("-")[1];
            var inputCantidad = document.getElementById("contador-cantidad-" + contador);
            if (this.checked) {
                if (inputCantidad.hasAttribute("disabled")) {
                    inputCantidad.focus();
                    inputCantidad.removeAttribute("disabled");
                }
            } else {
                if (!(inputCantidad.hasAttribute("disabled"))) {
                    inputCantidad.value = "0";
                    inputCantidad.setAttribute("disabled", "");
                }
            }
        });
    });

})();

(function($) {
    $.fn.inputFilter = function(inputFilter) {
      return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    };
}(jQuery));

$(".seleccionar-productos__contador .seleccionar-productos__quantity").inputFilter(function(value) {
    return /^-?\d*$/.test(value); 
});

function SeleccionarProductos() {
    $("#divLoading").show();
    $.ajax({
        url: RutaProducto,
        type: 'Post',
        data: {
        },
        async: true,
        cache: false,
        success: function (data) {
            //$('html, body').animate({
            //    scrollTop: 10
            //}, 1000);
            //$("#modal-truck-thirdparty .modal-main").html(data);
            if (data.CodigoRespuesta == 1) {
                $("#divLoading").hide();
                window.location.href = SeleccioneProducto;
            }
            else {
                $("#divLoading").hide();
                alert(data.Mensaje);
            }
        },
        error: function () {
            $("#divLoading").hide();
            // alertModal("Se produjo un error al obtener los datos.");
        }
    });
}

function showAlert(id, title, description) {
    document.querySelector("#" + id + " .alertTitle").innerHTML = title;
    document.querySelector("#" + id + " .alertDescription").innerHTML = "   " + description;

    $("#" + id).fadeTo(2000, 500).slideUp(500, function () {
        $("#" + id).slideUp(500);
    });
}

function ContinuarProductos() {
   
    var selected = [];
    var hayProductosSeleccionadosSinCantidad = false;
    $('#checkProducto input:checked').each(function () {
        var res = $(this).attr('ID').split("-");
        //alert('tiene que seleccionar una cantidad' + res[1]);
        var nombrecantidad = 'contador-cantidad-' + res[1];
        var idproducto = res[0];
        var cantidad = document.getElementById(nombrecantidad).value;
        if (cantidad == 0) {
            hayProductosSeleccionadosSinCantidad = true;
            showAlert("success-alert", "Para Continuar!", "Debe ingresar las cantidades de los productos seleccionados.");
            return false;
        }
        selected.push(idproducto + ',' + $.trim(cantidad));
    });

    if (hayProductosSeleccionadosSinCantidad) {
        return false;
    }

    if (selected.length == 0) {
        showAlert("success-alert", "Para Continuar!", "Debe Seleccionar un producto.");
        return false;
    }

    $("#divLoading").show();
    var ValoresSeleccionado = "";
    for (var i = 0; i < selected.length; i++) {
        ValoresSeleccionado = ValoresSeleccionado + selected[i]+';';
    }

    $.ajax({
        url: RecuperarProductos,
        type: 'Post',
        data: {
            'CodigosProductos': ValoresSeleccionado
        },
        async: true,
        cache: false,
        success: function (data) {
            //$('html, body').animate({
            //    scrollTop: 10
            //}, 1000);
            //$("#modal-truck-thirdparty .modal-main").html(data);
            if (data.CodigoRespuesta == 1) {
                $("#divLoading").hide();
                window.location.href = AgregarDireccion;
            }
            else {
                $("#divLoading").hide();
                alert(data.Mensaje);
            }
        },
        error: function () {
            $("#divLoading").hide();
            // alertModal("Se produjo un error al obtener los datos.");
        }
    });
}

function ContinuarDireccion() {

    //$.validator.addMethod("alfanumOespacio", function (value, element) {
    //    return /^[ a-z0-9áéíóúüñ]*$/i.test(value);
    //}, "Ingrese sólo letras, números o espacios.");

    //$('#form-agregar-direccion-obra').validate({
    //    rules: {
    //        agrega_persona: {
    //            alfanumOespacio: true,
    //            required: true,
    //        }
    //    }
    //});

    if ($('#input_direccion_obra').val().trim().length <= 0) {
        $("#span-alert-direccion-obra").text("escribe la dirección de entrega.");

        $("#success-alert-direccion-obra").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert-direccion-obra").slideUp(500);
        });
        return false;
    }

    if (tiendasRecomendadas == null) {
        $("#success-alert-cobertura").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert-cobertura").slideUp(500);
        });
        return false;
    } else
        if (tiendasRecomendadas.length == 0) {
            $("#success-alert-cobertura").fadeTo(5000, 500).slideUp(500, function () {
                $("#success-alert-cobertura").slideUp(500);
            });
            return false;
        }

    //Validación campo "Referencia"
    if (!$('#agrega-referencia')[0].checkValidity()) {
        $("#span-alert-direccion-obra").text("escribe una referencia.");

        $("#success-alert-direccion-obra").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert-direccion-obra").slideUp(500);
        });
        return false;
    }

    //Validación campo "Referencia"
    if (!$('#agrega-persona')[0].checkValidity()) {
        $("#span-alert-direccion-obra").text("escribe un nombre de contacto.");

        $("#success-alert-direccion-obra").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert-direccion-obra").slideUp(500);
        });
        return false;
    }

    //Validación campo "Referencia"
    if (!$('#agrega-celular')[0].checkValidity()) {
        $("#span-alert-direccion-obra").text("escribe un celular de 9 dígitos.");

        $("#success-alert-direccion-obra").fadeTo(5000, 500).slideUp(500, function () {
            $("#success-alert-direccion-obra").slideUp(500);
        });
        return false;
    }

    $("#divLoading").show();

    var codigoRecomen = [];
    for (var i = 0; i < tiendasRecomendadas.length; i++) {
        codigoRecomen[i] = tiendasRecomendadas[i].CodigoPDV;
    }

    $.ajax({
        url: RecuperarDatosObra,
        type: 'Post',
        data: {
            'direccion': $('#input_direccion_obra').val(),
            'referencia': $('#agrega-referencia').val(),
            'persona_contacto': $('#agrega-persona').val(),
            'telefono': $('#agrega-celular').val(),
            'latitud': LatitudObraEncontrada,
            'longitud': LongitudObraEncontrada,
            'recomendaciones': codigoRecomen
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.CodigoRespuesta == 1) {
                $("#divLoading").hide();
                window.location.href = DetalleProductoComprar;
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
