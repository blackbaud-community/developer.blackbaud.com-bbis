# BBIS Custom Content Part - "Featured Image"

This documentation covers how to create an advanced Custom Content Part.  We'll be creating a "Featured Story," where the end user's (in edit mode) have access to a couple pre-defined fields.  You as the developer will have control over how this information is dynamically rendered on the front-end via JavaScript.

## Create a New Custom Content Part

### Editor Input

```HTML
<!--<script src="/file/featured-image-editor.js"></script>-->
<script src="//dl.dropbox.com/s/i5jywjvxd84dkfg/featured-image-editor.js"></script>
<dl class="dl-horizontal">
  <dt><button class="btn-select-link">Select Link</button></dt>
  <dd class="selected-link"></dd>
  
  <dt><button class="btn-select-image">Select Image</button></dt>
  <dd class="selected-image"></dd>
</dl>
```

### Display Input

```HTML
<script>
// Function name specified in the Custom Content Part
// For simplicity, I've made this method available in the global namespace.
function InitializeFeaturedImage(settings, element) {

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
