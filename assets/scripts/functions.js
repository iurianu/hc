jQuery.noConflict();

jQuery( document ).ready(function( $ ) {
    
    $('input[name="date"]').on('click focus', function() {
        $(this).attr('type', 'date');
    })
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $('#myCarousel').carousel({
      interval: 10000
    })

    if ($(window).width() > 768) {
        $('#slideCarousel .carousel-item').each(function(){
          var next = $(this).next();
          if (!next.length) {
            next = $(this).siblings(':first');
          }
          next.children(':first-child').clone().appendTo($(this));      

        })    
    }
    
});