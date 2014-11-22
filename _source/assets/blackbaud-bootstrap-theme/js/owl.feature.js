/**
* Feature
* @since 2.0.0
*
* This feature allows individual elements to be animated within a slide.
* This took much blood sweat and tears.
* You might think we could store the animations for quicker index when triggering them later on.
* I, too, thought that, but it won't work b/c of the slides being cloned.
*/
;(function ( $, window, document, undefined ) {
    
  /**
  * Create private feature object
  **/
  Feature = function(Carousel){
    
    this._core = Carousel;
    this._core.options = $.extend({}, Feature.Defaults, this._core.options);
    this._queue = [];
    this._handlers = {
      'initialized.owl.carousel translated.owl.carousel': $.proxy(function(e) {
        this.reset();
        this.animate($(e.currentTarget).find('.owl-item.active'));
      }, this)
    };

    // register event handlers
    this._core.$element.on(this._handlers);
  }

  /**
  * Default options for our customization
  **/
  Feature.Defaults = {
    featureAnimationDelimiterAnimations: ' ',
    featureAnimationDelimiterDelay: ':',
    featureAnimationAnimatedClass: 'animated',
    featureAnimationDataSelector: 'animate',  // Combined to form [data-{ featureAnimationDataSelector }]
  }

  /**
  * Resets any animations running or schedule
  **/
  Feature.prototype.reset = function() {
    for (var i = 0, j = this._queue.length; i < j; i++) {
      clearTimeout(this._queue[i].timeout); 
      $(this._queue[i].element).removeClass(this._core.options.featureAnimationAnimatedClass + ' ' + this._queue[i].animation);
    }
    this._queue = [];
  },
  
  /**
  * Finds all the animations and schedules them.
  **/
  Feature.prototype.animate = function(item) {
    
    // Find any animations
    $(item).find('[data-' + this._core.options.featureAnimationDataSelector + ']').each($.proxy(function(index, html) {
      
      // Allow multiple animations to be specified
      var element = $(html),
          data = element.data(this._core.options.featureAnimationDataSelector),
          groups = data.split(this._core.options.featureAnimationDelimiterAnimations);
      
      // Stop the events from bubbling
      element.one($.support.transition.end, function(e) {
        e.stopPropagation();
      });
      
      for (var i = 0, j = groups.length; i < j; i++) {
        
        // Animations can support an optional delay
        var parts = groups[i].split(this._core.options.featureAnimationDelimiterDelay),
            animation = parts[0] + ' ' + this._core.options.featureAnimationAnimatedClass,
            delay = parts.length == 2 ? parseInt(parts[1]) : 0,
            timeout = setTimeout($.proxy(function(element, cssClass) {
              element.addClass(cssClass);
            }, this, element, animation), delay);
        
          // Store our timeout in case we need to clear it
          // Also have to pass in the element + animation to proxy
          this._queue.push({
            element: element,
            timeout: timeout,
            animation: animation
          });
      }
    }, this));
  }
  
  // Expose our plugin
  $.fn.owlCarousel.Constructor.Plugins['feature'] = Feature;
  
})( window.Zepto || window.jQuery, window,  document );