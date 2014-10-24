!function($) {

	$(function() {

      // Main purpose was driven by 'A' not being allowed in nav-bar and styled as btn.
      $(document).on('click', 'button[data-href]', function(e) {
          e.preventDefault();
          location.href = $(this).data('href');
      });

      // Add scroll to page positions
      $(document).on('click', '[data-scroll-to]', function(e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $($(this).data('scroll-to')).offset().top
        }, 1000);
      });
      
      // Initialize Owl Carousel      
      var carousel = $('.carousel').owlCarousel({
        featureWaitForAnimation: false,
        autoplayHoverPause: true,
        autoplay: false,
        loop: true,
        items: 1,
        animateOut: 'fadeOut'
      });

	});

}(jQuery);
