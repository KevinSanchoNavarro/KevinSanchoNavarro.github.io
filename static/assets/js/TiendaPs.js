$("#fotoPerfilTienda").click(function () {
    var srcImg = this.src;
    if (!srcImg.includes("LogoDefecto")) { 
        document.getElementById('popupFotoPerfilTienda').classList.toggle('d-none');
        $('.imagepreview').attr('src', srcImg);
    }
});

$("#cerrarPopupPerfilTienda").click(function () {
    document.getElementById('popupFotoPerfilTienda').classList.add('d-none');
});