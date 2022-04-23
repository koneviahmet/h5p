var H5P = H5P || {};
 
H5P.Alphabet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      alphabet: null
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
    var selectIndex = 0;
    var alphabets = this.options.alphabet[0]
    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-greetingcard");

    console.log(alphabets);


    //add images
    $container.append('<div class="greeting-text">' + alphabets.title + '</div>');
    if (alphabets.image && alphabets.image.path) {
      $container.append($('<img>',{
        class: 'alphabet-image animate__animated',
        alt: "image alt",
        src: H5P.getPath(alphabets.image.path, this.id),
        load: function () {
          self.trigger('resize')
        }
      }))
    }

    //sesler
    var audio = H5P.newRunnable(alphabets.audio, this.id);
    var audioTrue = H5P.newRunnable(alphabets.audioTrue, this.id);
    var audioFalse = H5P.newRunnable(alphabets.audioFalse, this.id);
    
    var $audioContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
 
    audio.on('resize', function(){
      self.trigger('resize');
    })
    audio.attach($audioContainer);
    $audioContainer.appendTo($container);

    var $audioTrueContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    audioTrue.on('resize', function(){
      self.trigger('resize');
    })
    audioTrue.attach($audioTrueContainer);
    $audioTrueContainer.appendTo($container);

    var $audioFalseContainer = $('<div>', {
      'class': 'h5p-webinar-quiz'
    })
    audioFalse.on('resize', function(){
      self.trigger('resize');
    })
    audioFalse.attach($audioFalseContainer);
    $audioFalseContainer.appendTo($container);

    // Add greeting text.
    var playButton = $('<button>', {
      'class': "answer-play",
      'aria-label': "label?"
    }).html("Başla")
    $container.append(playButton);

    playButton.on('click', function(){
      audio.play();
    })

    audio.audio.addEventListener('ended', function () {
      console.log("ses bitti");
      stopAnswer()
    })

    audio.audio.addEventListener('play', function () {
      playAnswer()
    })

    audioTrue.audio.addEventListener('ended', function () {
      console.log("ses bitti");
      stopAnswer()
    })

    audioTrue.audio.addEventListener('play', function () {
      playAnswer()
    })

    audioFalse.audio.addEventListener('ended', function () {
      console.log("ses bitti");
      stopAnswer()
    })

    audioFalse.audio.addEventListener('play', function () {
      playAnswer()
    })


    var buttonContent = $('<div>', {
      'class': "true-false-button-content",
      'aria-label': "label?"
    })

    var trueButton = $('<button>', {
      'class': "answer-button answer-button-true",
      'aria-label': "label?"
    }).html("Doğru")
    $container.append(trueButton);

    var falseButton = $('<button>', {
      'class': "answer-button answer-button-false",
      'aria-label': "label?"
    }).html("Yanlış")

    buttonContent.append(trueButton)
    buttonContent.append(falseButton)
    $container.append(buttonContent);

    
    trueButton.on('click', function(){
      checkAnswer(true)
    })
    
    
    falseButton.on('click', function(){
      checkAnswer(false)
    })
    

    function checkAnswer(selectAnswer){
      playAnswer()
     
      if (selectAnswer == self.options.correct) {
        audioTrue.play()
      }else{
        audioFalse.play()
      }
    } 


    function playAnswer(){
      $('.answer-button').addClass('answer-button-wait')
      $('.answer-play').addClass('answer-play-wait')
    }

    function stopAnswer(){
      $('.answer-button').removeClass('answer-button-wait')
      $('.answer-play').removeClass('answer-play-wait')
    }

    //style
    $('.h5p-audio-inner').hide()

    
    
  

  };
  
 
  return C;
})(H5P.jQuery);