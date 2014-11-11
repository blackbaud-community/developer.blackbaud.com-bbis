!function($) {

	$(function() {
      
      var body = $('body'),
          sidebarToggle = $('.toggle-sidebar'),
          sidebarWrapper = $('.sidebar-wrapper'),
          sidebar = $('.sidebar'),
          sidebarNav = $('.nav-sidebar'),
          copyCode = $('.copy-code'),
          content = $('.content-wrapper'),
          contentToggle = content.data('toggle'),
          isSandcastle = body.hasClass('subsection-bbncextensions');

      // Trigger prev carousel slide
      $('.carousel-prev').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('owl.prev');
      });
      
      // Trigger next carousel slide
      $('.carousel-next').click(function(e) {
        e.preventDefault();
        $('.carousel').trigger('owl.next');
      });
      
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
        
        client.on('ready', function() {
          bridge = $('#global-zeroclipboard-html-bridge');
          bridge.data('placement', 'left').data('trigger', 'manual').attr('title', 'Copied!').tooltip();
        });
        
        copyCode.on('mouseover', function() {
          $(this).tooltip('show');
        });
        
        copyCode.on('mouseout', function() {
          $(this).tooltip('hide');
          bridge.tooltip('hide');
        });
        
        client.on('copy', function(e) {
          e.clipboardData.setData('text/plain', $(e.target).siblings('.highlight').text());
        });
        
        client.on('aftercopy', function(e) {
          copyCode.tooltip('hide');
          bridge.tooltip('show');
        });
      }

	});

}(jQuery);
