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

    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-greetingcard");
    // Add image if provided.
    if (this.options.image && this.options.image.path) {
      $container.append($('<img>',{
        class: 'greeting-image',
        alt: "image alt",
        src: H5P.getPath(this.options.image.path, this.id),
        load: function () {
          self.trigger('resize')
        }
      }))


      // })).on('click', function () {
      //   alert('greeting card')
      // })
    }

    // Add greeting text.
    $container.append('<div class="greeting-text">' + this.options.greeting + '</div>');


    //add quiz
    var quiz = H5P.newRunnable(this.options.quiz, this.id);
    var $quizContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    
    quiz.on('resize', function(){
      self.trigger('resize');
    })

    quiz.attach($quizContainer);
    $quizContainer.appendTo($container);


  };
  
 
  return C;
})(H5P.jQuery);