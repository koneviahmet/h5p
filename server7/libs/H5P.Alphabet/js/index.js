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
      audioTrue: null,
      audioFalse: null,
      image: null,
      isTrue: null,

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

    //add images
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

    var playButton = $('<button/>', {
      'class': "play",
      'aria-label': "label?"
    }).html("dinle")
    $container.append(playButton);

    playButton.on('click', function(){
      audio.play();
    })


    //audio true and false
    var audioTrue = H5P.newRunnable(this.options.audioTrue, this.id);
    var $audioTrueContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    audioTrue.on('resize', function(){
      self.trigger('resize');
    })
    audioTrue.attach($audioTrueContainer);
    $audioTrueContainer.appendTo($container);

    var audioFalse = H5P.newRunnable(this.options.audioFalse, this.id);
    var $audioFalseContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    audioFalse.on('resize', function(){
      self.trigger('resize');
    })
    audioFalse.attach($audioFalseContainer);
    $audioFalseContainer.appendTo($container);



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

 
    audio.audio.addEventListener('ended', function () {
      $('.h5p-true-false-answer').removeClass('h5p-true-false-answer-wait')
      console.log("ses bitti");
    })

    audio.audio.addEventListener('play', function () {
      $('.h5p-true-false-answer').addClass('h5p-true-false-answer-wait')
      console.log("ses başladı");
    })

    audioTrue.audio.addEventListener('ended', function () {
      $('.h5p-true-false-answer').removeClass('h5p-true-false-answer-wait')
      console.log("ses bitti");
    })

    audioTrue.audio.addEventListener('play', function () {
      $('.h5p-true-false-answer').addClass('h5p-true-false-answer-wait')
      console.log("ses başladı");
    })

    audioFalse.audio.addEventListener('ended', function () {
      $('.h5p-true-false-answer').removeClass('h5p-true-false-answer-wait')
      console.log("ses bitti");
    })

    audioFalse.audio.addEventListener('play', function () {
      $('.h5p-true-false-answer').addClass('h5p-true-false-answer-wait')
      console.log("ses başladı");
    })


   

    audio.on("play", function(){
      console.log("başladı");
    })

    $('.stop').on('click', function(){
      audio.stop();
    })


    //add isTrue
    var isTrue = H5P.newRunnable(this.options.isTrue, this.id);
    var $trueContainer = $('<div>', {
      'class': 'h5p-webinar-isTrue'
    })
    
    isTrue.on('resize', function(){
      self.trigger('resize');
    })

    isTrue.attach($trueContainer);
    $trueContainer.appendTo($container);
    


    $('.h5p-question-introduction').hide();
    $('.h5p-question-check-answer').hide();
    $('.h5p-audio-inner').hide();
    $('.h5p-true-false-answer').on('click', function(){
      var selectAnswer = isTrue.getCurrentState();
      var trueAnswer   = isTrue.getAnswerGiven();
      if (trueAnswer == selectAnswer.answer) {
        console.log("doğru yaptın");
        audioTrue.play()
        $('.h5p-question-check-answer').trigger('click');
      }else{
        console.log("yanlış yaptın");
        audioFalse.play()
      } 
    });







  };
  
 
  return C;
})(H5P.jQuery);