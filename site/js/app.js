!function($) {

	$(function() {

      $('.carousel-prev').click(function(e) {
        e.preventDefault();
        carousel.trigger('prev.owl.carousel');
      });
      
      $('.carousel-next').click(function(e) {
        e.preventDefault();
        carousel.trigger('next.owl.carousel');
      });

	});

}(jQuery);
