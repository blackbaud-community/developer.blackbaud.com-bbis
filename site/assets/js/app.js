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
      
      var sidebar = $('.sidebar'),
          nav = $('.nav-sidebar');
      
      if (sidebar.length) {
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

        $('body').scrollspy({
          target: '#sidebar'
        });
      }

	});

}(jQuery);
