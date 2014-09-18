!function($) {

	$(function() {

      $('.carousel-prev').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('prev.owl.carousel');
      });
      
      $('.carousel-next').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('next.owl.carousel');
      });
      
      var body = $('body'),
          sidebar = $('.sidebar'),
          nav = $('.nav-sidebar');
      
      if (sidebar.length && !body.hasClass('section-reference')) {
        
        nav.affix({
          offset: {
            top: sidebar.offset().top,
            bottom: function() {
              return $('.footer').outerHeight() + $('.copyright').outerHeight() + 20;
            }
          }
        });

        $(window).resize(function() {
          nav.css('width', sidebar.width() + 'px');
        }).trigger('resize');

        body.scrollspy({
          target: '.sidebar'
        });
        
        $('.back-to-top a').click(function(e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: 0
          }, 500);
        })
      }
        
      $('.section-reference .sidebar li.active').parents('ul').each(function() {
        $(this).addClass('trail');
      });

	});

}(jQuery);
