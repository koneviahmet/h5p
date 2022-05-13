var H5P = H5P || {};
 
H5P.GreetingCard = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      greeting: 'Hello world!',
      image: null,
      quiz: null
    }, options);
    // Keep provided id.
    this.id = id;
  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    var self = this
    
    this.on('resize', function () {
      // Give some constraints for when changes should happen to NewContent
      console.log("genişledim ben");
    });

  

  };
  
 
  return C;
})(H5P.jQuery);