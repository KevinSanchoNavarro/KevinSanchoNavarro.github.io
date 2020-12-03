$(document).ready(function () {
    $(".tab_content").hide();
    $(".tab_content:first").show();
    $("#locales").css("display", "block");
});

/* Te sirvio el contenido */
function handleOnSelectedScoreOption(event) {
    const scoreContainer = document.getElementById('content-score');
    const { target } = event;
    if (target.classList.contains('option') || target.closest('div.option')) {
        Array.from(scoreContainer.getElementsByTagName('div')).forEach((tag) => {
            if (target.classList.contains('option') && tag !== target) {
                target.classList.remove('unselected');
                //console.log('Primero:' + target.classList.value);   
                numeroPuntajeSeleccionado = target.classList.value;
                tag.classList.add('unselected');
            } else if (
                target.closest('div') &&
                tag !== target.closest('div.option')
            ) {
                target.closest('div.option').classList.remove('unselected');
                //console.log('Segundo:' + target.closest('div.option').classList.value);        
                numeroPuntajeSeleccionado = target.closest('div.option').classList.value;
                tag.classList.add('unselected');
            }
        });


        $('#btnRegistrarOpinion').removeAttr('disabled');
    }
}

function ResetearControlesRegistroOpinionCliente() {
    numeroPuntajeSeleccionado = "0";
    const scoreContainer = document.getElementById('content-score');
    Array.from(scoreContainer.getElementsByTagName('div')).forEach((tag) => {
        tag.classList.remove('unselected');
    });

    $('#btnRegistrarOpinion').attr('disabled', 'disabled');
}

/* Index */
function handleRequest({ target }) {
    const cancelButton = document.getElementById('cancelButton');
    cancelButton.classList.remove('d-none');
    const isValidValue = target.value.trim().length > 0;
    if (isValidValue) {
        makeRequest(target.value);
    }
    if (!target.value.length > 0 || !target.value.trim().length > 0) {
        clearInput();
        cancelButton.classList.add('d-none');
        document.getElementById('results').classList.add('hide');
    }
}

function clearInput(event) {
    document.getElementById('cancelButton').classList.toggle('d-none');
    //document.getElementById('results').classList.add('d-none');
    //document.getElementById('locales').classList.add('d-none');
    document.getElementById('pac-input').value = '';
    document.getElementById('pac-input').focus();
}

function makeRequest(address) {
    const data = getFromDB(address);
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    if (!data.length > 0) {
        const template = `
      <div id="results" class="result">
        <span class="title">No hubo resultados</span>
        <span class="description">Intente otra vez</span>
      </div>
    `;
        resultsContainer.innerHTML = template;
    } else {
        data.forEach((result) => {
            const template = `
        <div data-id="${Math.floor(
                Math.random() * 10 + 1,
            )}" class="ep-1-item d-flex flex-column">
          <p>${result.title}</p>
          <p>${result.description}</p>
        </div>
      `;
            resultsContainer.innerHTML += template;
        });
        resultsContainer.addEventListener('click', showLocales);
        resultsContainer.classList.remove('d-none');
    }
}

var urlEncuentraProgresol = 'Tienda/MiProgresol';
var urlApiWaCelularPdv = '';

function showLocales({ target }) {
    const localID =
        typeof target.dataset.id !== 'undefined'
            ? target.dataset.id
            : target.closest('.ep-1-item').dataset.id;
    const localesContainer = document.getElementById('locales');
    const data = getLocalesFromDB(localID);
    localesContainer.addEventListener('click', function ({ target }) {
        if (target.classList.contains('ep-2-item__c2a-1')) {
            location.href = urlEncuentraProgresol;
        }
        if (target.classList.contains('ep-2-item__c2a-2')) {
            location.href = urlSeleccionarProducto;
        }
    });
    data.forEach((local) => {
        const template = `
      <div class="ep-2-item p-4 d-flex flex-column">
        <p class="ep-2-item__name">${local.name}</p>
        <div class="d-flex align-items-center mb-2">
          <p class="ep-2-item__score">${local.rate.media}</p>
          <div class="d-flex ep-2-item__stars">
            <div class="icon-star"></div>
            <div class="icon-star"></div>
            <div class="icon-star"></div>
            <div class="icon-star"></div>
            <div class="icon-star"></div>
          </div>
          <p class="ep-2-item__valoraciones">${local.rate.interactions} Valoraciones</p>
        </div>
        <div class="d-flex align-items-center mb-2">
          <div class="icon-marker"></div>
          <div class="ep-2-item__address ml-2">
            <p>${local.address.first}</p>
            <p>${local.address.second}</p>
          </div>
        </div>
        <div class="d-flex align-items-center mb-2">
          <div class="icon-watch"></div>
          <div class="ep-2-item__horary ml-2">
            <p>7:00 a 18:00 hrs</p>
          </div>
        </div>
        <div
          class="d-flex flex-row ep-2-item__c2a justify-content-between align-content-center"
        >
          <button onclick="window.location.replace('')" class="ep-2-item__c2a-1">Ver m&aacute;s</button>
          <button class="ep-2-item__c2a-2">
            <div onclick="window.location.replace('')" class="icon-whatsapp"></div>
            Hacer pedido
          </button>
        </div>
      </div>
    `;
        localesContainer.innerHTML += template;
    });
    initMap();
    localesContainer.classList.remove('d-none');
    document.getElementById('results').classList.add('d-none');
}

function getLocalesFromDB(id) {
    const data = [
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
        {
            name: 'Ferretería Las Casuarinas',
            rate: {
                media: '4,5',
                interactions: 35,
            },
            address: {
                first: 'Av Naranjal 2089',
                second: 'Los Olivos, Lima, Lima',
            },
            horary: '7:00-18:00',
        },
    ];
    return data;
}

function getFromDB(address) {
    const rawData = [
        {
            title: 'Los Jazmines de Naranjal',
            description: 'Los olivos, Lima, Lima',
        },
        {
            title: 'Los Jazmines de Naranjal',
            description: 'Los olivos, Lima, Lima',
        },
        ,
        {
            title: 'Los Jazmines de Naranjal',
            description: 'Los olivos, Lima, Lima',
        },
        ,
        {
            title: 'Los Jazmines de Naranjal',
            description: 'Los olivos, Lima, Lima',
        },
    ];
    return rawData;
}
/* Global Menu */
function handleMenuVisibility({ target }) {
    if (target.checked) {
        const navlist = document.getElementById('nav-list');
        navlist.classList.toggle('d-none');
    } else {
        const navlist = document.getElementById('nav-list');
        navlist.classList.toggle('d-none');
    }
}
function handleResizeNavBar() {
    if (window.innerWidth > 768) {
        document.getElementById('nav-list').style.display = 'initial !important';
    } else {
        const checked = document.getElementById('nav').checked;
        if (checked) {
            document.getElementById('nav-list').style.display = 'initial !important';
        } else {
            document.getElementById('nav-list').style.display = 'none !important';
        }
    }
}
function closeNav() {
    document.getElementById('nav-list').classList.toggle('d-none');
}

window.addEventListener('resize', handleResizeNavBar);

function toggleRegistrarFerreteria() {
    document.getElementById('registrar-ferreteria').classList.toggle('d-none');
}

function showTyC() {
    document.getElementById('popup-tyc').classList.remove('d-none');
}
function toggleTyC() {
    document.getElementById('popup-tyc').classList.toggle('d-none');
}

function showFerreteriaRegistrada() {
    document.getElementById('registrar-ferreteria').classList.toggle('d-none');
    document.getElementById('ferreteria-registrada').classList.toggle('d-none');
}

function toggleFerreteriaRegistrada() {
    document.getElementById('ferreteria-registrada').classList.toggle('d-none');
}

function toggleEnviarSugerencia() {
    document.getElementById('enviar-sugerencia').classList.toggle('d-none');

    ResetearControlesRegistroOpinionCliente();
}

function togglePedidoEnviado() {
    document.getElementById('pedido-enviado').classList.toggle('d-none');
}
/* Contador */
function sumarContador(idProducto, num) {
    const contador = document.getElementById(`contador-cantidad-${num}`);

    if (contador.value === "" || contador.value == null || contador.value == undefined) {
        contador.value = "1";
    } else {
        contador.value = parseInt(contador.value) + 1;
    }

    const checkbox = document.getElementById(`${idProducto}-${num}`);
    if (!checkbox.checked) {
        checkbox.checked = true;
        if (contador.hasAttribute("disabled")) {
            contador.removeAttribute("disabled");
        }
    }
}

function restarContador(num) {
    const contador = document.getElementById(`contador-cantidad-${num}`);

    if (contador.value === "" || contador.value == null || contador.value == undefined) {
        contador.value = "0";
    } else if (parseInt(contador.value) > 0) {
        contador.value = parseInt(contador.value) - 1;
    }
}

function toggleMapSwitch(event) {
    const { checked: isChecked } = document.getElementById('map-switch-button');
    if (isChecked) {
        document.getElementById('map-switch').style.left = '50%';
        const icon = document.getElementById('map-switch-toggle');
        icon.classList.remove('icon-switch-list');
        icon.classList.remove('d-none');
        icon.classList.add('icon-map-marker');

        document.getElementById('locales').style.display = 'none';
    } else {
        document.getElementById('map-switch').style.left = '0';
        const icon = document.getElementById('map-switch-toggle');
        icon.classList.remove('icon-map-marker');
        //icon.classList.add('icon-switch-list');

        document.getElementById('locales').style.display = 'block';
    }
}

function validateLetter(event) {
    var regex = new RegExp("^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}


//Busqueda por nombre
//function onInput() {
//    var val = document.getElementById("inputBuscaPorNombre").value;
//    var opts = document.getElementById('listaProgresoles').childNodes;
//    for (var i = 0; i < opts.length; i++) {
//        if (opts[i].value === val) {
//            // yourCallbackHere()
//            //console.log(opts[i].value);
//            ConsultarProgresolesPorNombre(opts[i].value);
//            break;
//        }
//    }
//}

$("ul.tabs li").click(function () {
    $("ul.tabs li").removeClass("active");
    $(this).addClass("active");
    $(".tab_content").hide();

    if ($(this).attr("id") == 'tabBuscaPorUbicacion') {
        //$("#tabBuscaPorNombre").addClass("inactiva_tab");
        $("#tab1").fadeIn();
        $("#tab2").fadeOut();

        InicializarBusquedaPorUbicacion()
    } else {
        $("#tab1").fadeOut();
        $("#tab2").fadeIn();
    }
});

function clearTextoBuscarPorNombre(event) {
    document.getElementById('btnBorrarTextoBuscaPorNombre').classList.toggle('d-none');
    //document.getElementById('locales').classList.add('d-none');
    document.getElementById('inputBuscaPorNombre').value = '';
    document.getElementById('inputBuscaPorNombre').focus();
}