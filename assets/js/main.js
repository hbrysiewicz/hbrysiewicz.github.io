$(document).ready(function() {

  var img = $('.img').css('background-image')
  img = img.replace('url(','').replace(')','')
  $('.img').backstretch(img, { fade: 'slow' })

  $(window).on('resize', function() {
    $('.img').backstretch('resize')
  })
})
