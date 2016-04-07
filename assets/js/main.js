$(document).ready(function() {

  var img = $('.img').css('background-image')
  img = img.match(/url\(\"?(.+)\"?\)/)[1]
  $('.img').backstretch(img, { fade: 'slow' })

  $(window).on('resize', function() {
    $('.img').backstretch('resize')
  })
})
