var H5P = H5P || {};
 
H5P.Alphabet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      greeting: 'Hello world!',
      audio: null,

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


    // Add greeting text.
    $container.append('<div class="greeting-text">' + this.options.greeting + '</div>');
    $container.append('<button class="stop">stop</button>');

    var playButton = $('<button/>', {
      'class': "play",
      'aria-label': "label?"
    }).html("play")
    $container.append(playButton);

    //add quiz
    var audio = H5P.newRunnable(this.options.audio, this.id);
    var $quizContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    
    audio.on('resize', function(){
      self.trigger('resize');
    })

    audio.attach($quizContainer);
    $quizContainer.appendTo($container);

    playButton.on('click', function(){
      audio.play();
    })

    audio.audio.addEventListener('ended', function () {
      console.log("ses bitti");
    })

    audio.audio.addEventListener('play', function () {
      console.log("ses başladı");
    })

  


    audio.audio.addEventListener('pause', function () {
      console.log("ses durdu");
    })
    
    audio.on("play", function(){
      console.log("başladı");
    })

    $('.stop').on('click', function(){
      audio.stop();
    })





  };
  
 
  return C;
})(H5P.jQuery);