$(document).ready(function() {
  $('.img').backstretch('/assets/img/header.jpg', {fade: 'slow'})

  $(window).on('resize', function() {
    $('.img').backstretch('resize')
  })
})