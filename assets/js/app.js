!function($) {

	$(function() {
      
      var body = $('body'),
          sidebarToggle = $('.toggle-sidebar'),
          sidebarWrapper = $('.sidebar-wrapper'),
          sidebar = $('.sidebar'),
          sidebarNav = $('.nav-sidebar'),
          content = $('.content-wrapper'),
          contentToggle = content.data('toggle'),
          isReference = body.hasClass('section-reference');
      
      // Remember if we're showing the sidebar
      if (isReference && $.cookie('nav') == 'true') {
        toggleSidebar(false);
      }

      // Trigger prev carousel slide
      $('.carousel-prev').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('prev.owl.carousel');
      });
      
      // Trigger next carousel slide
      $('.carousel-next').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('next.owl.carousel');
      });
      
      // These only happen if there's a sidebar and it's not the technical reference.
      if (sidebar.length && !isReference) {
        
        // Initiate affix
        sidebarNav.affix({
          offset: {
            top: sidebar.offset().top,
            bottom: function() {
              return $('.footer').outerHeight() + $('.copyright').outerHeight() + 20;
            }
          }
        });

        // Catch our window resizing
        $(window).resize(function() {
          sidebarNav.css('width', sidebar.width() + 'px');
        }).trigger('resize');

        // Initiate scrollspy
        body.scrollspy({
          target: '.sidebar'
        });
        
        // Smooth scroll back to the top
        $('.back-to-top a').click(function(e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: 0
          }, 500);
        });

      }
      
      // These only happen on the technical reference
      if (isReference) {

        // Make the sidebar trail visible
        $('.section-reference .sidebar li.active').parents('ul').each(function() {
          $(this).addClass('trail');
        });

        // Write the minimum height CSS rule
        $('<style>.nav-visible .content-wrapper { min-height: ' + sidebarWrapper.height() + 'px; }</style>').appendTo('head');

        // Toggle our classes
        sidebarToggle.click(function(e) {
          e.preventDefault();
          toggleSidebar(true);
        });
        
      }
      
      // Function that toggles the sidebar.
      // Can be called immediately
      function toggleSidebar(storeCookie) {
        body.toggleClass('nav-visible');
        content.toggleClass(contentToggle);
        if (storeCookie) {
          $.cookie('nav', $.cookie('nav') == 'true' ? 'false' : 'true', { path: '/' });
        }
      }

	});
  
  // Initialize any tooltips
  $('[data-toggle="tooltip"]').tooltip();

}(jQuery);
