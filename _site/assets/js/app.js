!function($) {

	$(function() {
      
      var $window = $(window),
          body = $('body'),
          sidebarToggle = $('.toggle-sidebar'),
          sidebarWrapper = $('.sidebar-wrapper'),
          sidebar = $('.sidebar'),
          sidebarNav = $('.nav-sidebar'),
          copyCode = $('.copy-code'),
          equalHeight = $('.equal-height'),
          isSandcastle = body.hasClass('subsection-bbncextensions');
      
      // Make columns equal height
      if (equalHeight.length) {
        $window.on('resize', function() {
          
          var width = $window.width(),
              height = 0;

          if (width > 767) {
            equalHeight.each(function() {
              var h = $(this).height();
              height = h > height ? h : height;
            });
          }
          
          equalHeight.css('min-height', height + 'px');
          
        }).trigger('resize');
      }
      
      // These only happen on the technical reference (BBNCExtensions)
      if (isSandcastle) {
        
        var url = window.location.pathname,
            file = url.substring(url.lastIndexOf('/') + 1),
            active = $('.section-reference .sidebar a[href="' + file + '"]');

        // Make the sidebar trail visible
        active.closest('li').addClass('active');
        active.parents('ul').each(function() {
          $(this).addClass('trail');
        });
        
        // Set the default language - can be "vb"
        try {
          OnLoad('cs');
        } catch (err) {}
        
      // These only happen if there's a sidebar and it's not the technical reference.
      } else if (sidebar.length) {
        
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
          target: '.scrollspy-start'
        });
        
        // Smooth scroll back to the top
        $('.back-to-top a').click(function(e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: 0
          }, 500);
        });

      }
      
      // Initialize Tooltips
      $('[data-toggle="tooltip"]').tooltip();
      
      // Initialize Clipboard Copy
      if (copyCode.length) {
        var client = new ZeroClipboard(copyCode);
        var bridge;
        
        // Show the tooltip
        copyCode.on('mouseover', function() {
          $(this).tooltip('show');
        });
        
        // Hide the tooltip and our manually created one in case it was open
        copyCode.on('mouseout', function() {
          $(this).tooltip('hide');
          bridge.tooltip('hide');
        });
        
        // When the SWF is ready, add our manually triggered tooltip
        client.on('ready', function() {
          bridge = $('#global-zeroclipboard-html-bridge');
          bridge.data('placement', 'left').data('trigger', 'manual').attr('title', 'Copied!').tooltip();
        });
        
        // This usually happens on mobile devices when the SWF doesn't or can't load.
        // We'll just hide the button in that case.
        client.on('error', function() {
          copyCode.hide();
        });
        
        // Copy the related content to the clipboard
        client.on('copy', function(e) {
          e.clipboardData.setData('text/plain', $(e.target).siblings('.highlight').text());
        });
        
        // Show the copied tooltip
        client.on('aftercopy', function(e) {
          copyCode.tooltip('hide');
          bridge.tooltip('show');
        });
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

	});

}(jQuery);
