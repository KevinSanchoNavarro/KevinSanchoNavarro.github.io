$(document).ready(function () {
  $('.autoplay').slick({
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    variableWidth: true,
    nextArrow: $('.next'),
    prevArrow: $('.prev'),
  });
});
