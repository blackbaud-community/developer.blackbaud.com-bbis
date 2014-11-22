(function($) {

  // Wait until jQuery says the DOM is ready
  $(function() {
  
    // Display the previously selected link
    if (typeof BLACKBAUD.api.customPartEditor.settings.link !== 'undefined') {
      $('.selected-link').text(BLACKBAUD.api.customPartEditor.settings.link.name);
    }
    
    // Display the previously selected image
    
    // Allow our settings to be saved.  We also use this method to implement validation.
    BLACKBAUD.api.customPartEditor.onSave = function() {
      var r = true;
      
      if (typeof BLACKBAUD.api.customPartEditor.settings.link === 'undefined') {
        r = false;
        alert('Link is required.');
      }
      
      if (false && typeof BLACKBAUD.api.customPartEditor.settings.image === 'undefined') {
        r = false;
        alert('Image is required.');
      }
      
      return r;
    };
  
    // Bind to the click event for our select link button
    $('.btn-select-link').click(function(e) {
    
      // Stop .NET from triggering a postback
      e.preventDefault();
      
      // Verify the user has the necessary permissions.
      // Alternatively, you could move this check outside the click handler and instead display a warning message.
      if (!BLACKBAUD.api.customPartEditor.links.canLaunchLinkPicker) {
        
        alert('You do not have the necessary permissions to launch this feature.');
        
      } else {
      
        // Launch link picker
        BLACKBAUD.api.customPartEditor.links.launchLinkPicker({
          callback: function(response) {
            
            // Don't overwrite if the user clicks cancel
            if (typeof response.name !== 'undefined') {
              BLACKBAUD.api.customPartEditor.settings.link = response;
              $('.selected-link').text(BLACKBAUD.api.customPartEditor.settings.link.name);
            }
            
          }
        });
      
      }
    
    });
    
    // Bind to the click event for our select image button
    $('.btn-select-image').click(function(e) {
    
      // Stop .NET from triggering a postback
      e.preventDefault();
      
      // Verify the user has the necessary permissions.
      if (!BLACKBAUD.api.customContentPart.UPDATE_THIS_METHOD) {
      
        alert('You do not have the necessary permissions to launch this feature.');
      
      } else {
      
        // Launch image picker
        // Update display
      
      }
    
    });
  
  });

}(jQuery))