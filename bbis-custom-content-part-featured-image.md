# BBIS Custom Content Part - "Featured Image"

This documentation covers how to create an advanced Custom Content Part.  We'll be creating a "Featured Story," where the end user's (in edit mode) have access to a couple pre-defined fields.  You as the developer will have control over how this information is dynamically rendered on the front-end via JavaScript.

## Create a New Custom Content Part

### Editor Input

```HTML
<script>
// Self executing module pattern
(function($) {

  // Wait until jQuery says the DOM is ready
  $(function() {
  
    // Bind to the click event for our select link button
    $('.btn-select-link').click(function(e) {
    
      // Stop .NET from triggering a postback
      e.stopPropagation();
      
      // Verify the user has the necessary permissions.
      // Alternatively, you could move this check outside the click handler and instead display a warning message.
      if (!BLACKBAUD.api.customContentPart.UPDATE_THIS_METHOD) {
        
        alert('You do not have the necessary permissions to launch this feature.');
        
      } else {
      
        // Launch link picker
      
      }
    
    });
    
    // Bind to the click event for our select image button
    $('.btn-select-image').click(function(e) {
    
      // Stop .NET from triggering a postback
      e.stopPropagation();
      
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
</script>
<dl>
  <dt><button class="btn-select-link">Select Link</button></dt>
  <dd class="selected-link"></dd>
  
  <dt><button class="btn-select-image">Select Image</button></dt>
  <dd class="selected-image"></dd>
</dl>
```

### Display Input

```HTML
<script>
// Function named specified in the Custom Content Part
// For simplicity, I've made this method available in the global namespace.
function CustomCallbackMethod(settings, element) {

  // Create our generated HTML.  A templating library such as Handlebars would work well here.
  var html = [
    '<div class="featured-image">',
    ' <h2>' + settings.title + '</h2>',
    ' <a href="' + settings.url + '">',
    '   <img src="' + settings.image + '" alt="" />',
    ' </a>',
    '</div>'
  ];

  // Update our element with the generated HTML
  $(element).html(html.join(''));
}
</script>
```
