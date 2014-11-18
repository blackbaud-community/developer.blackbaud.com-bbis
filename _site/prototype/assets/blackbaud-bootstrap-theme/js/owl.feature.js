/**
 * Feature
 * @since 2.0.0
 */
;(function ( $, window, document, undefined ) {
    
  Feature = function(Carousel){
    this._core = Carousel;
    
    // set default options
    this._core.options = $.extend({}, Feature.Defaults, this._core.options);
    
    // Quick reference to all our animations
    this._animations = [];
      
    // Queued animations;
    this._queue = [];
    
    // Events handlers
    this._handlers = {
      'prepared.owl.carousel': $.proxy(function(e) {
        var content = $(e.content),
            animations = content.find(this._core.options.featureAnimationSelector),
            events = this._core.options.featureAnimationEvents;
        
        // Quick access if we need to trigger animations
        this._animations.push(animations);
        
        // Loop through each animation and adds the animation end event listener
        // We also must stop these events or they'll propogate up to the slide animation (if it has one).
        animations.each(function(e) {
          $(this).on(events, function(e) {
            e.stopPropagation();
            $(this).attr('class', 'completed');
          });
        });
        
        // If animateOut is set, this event handler will fire, triggering our content animations.
        if (this._core.options.animateOut && this._core.options.featureWaitForAnimation) {
          content.on(events, $.proxy(function(e) {
            this.update(this._core.relative(this._core.current()));
          }, this));
        }
        
      }, this),
      
      'initialized.owl.carousel': $.proxy(function(e) {
        this.update(0);
      }, this)
    };
    
    // Only need this event if we're not waiting for slide animations to run
    if (!this._core.options.animateOut || !this._core.options.featureWaitForAnimation) {
      this._handlers['changed.owl.carousel'] = $.proxy(function(e) {
        if (e.property.name == 'position') {
          this.update(this._core.relative(this._core.current()));
        }        
      }, this);
    }

    // register event handlers
    this._core.$element.on(this._handlers);
  }

  Feature.Defaults = {
    featureAnimationSelector: '[data-animate]',
    featureAnimationEvents: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    featureWaitForAnimation: true
  }
  
  Feature.prototype.reset = function() {
    for (var i = 0, j = this._queue.length; i < j; i++) {
      clearTimeout(this._queue[i]); 
    }
    this._queue = [];
    for (var i = 0, j = this._animations.length; i < j; i++) {
      this._animations[i].each(function() {
        $(this).attr('class', '');
      });
    }
  }
  
  Feature.prototype.animate = function(element) {
    $(element).addClass('animated ' + $(element).data('animate'));
  }

  Feature.prototype.update = function(index) {
    this.reset();
    this._animations[index].each($.proxy(function(i, e) {
      
      var element = $(e),
          delay = element.data('delay');
      
      if (delay > 0) {
        this._queue.push(setTimeout($.proxy(function() {
          this.animate(element);
        }, this), delay));
      } else {
        this.animate(element); 
      }
      
    }, this));
  }
  
  // Expose our plugin
  $.fn.owlCarousel.Constructor.Plugins['feature'] = Feature;
  
})( window.Zepto || window.jQuery, window,  document );