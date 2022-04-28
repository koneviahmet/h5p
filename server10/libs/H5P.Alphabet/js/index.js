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
    var id   = this.id
    var selectIndex = 0;



    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-greetingcard");

    var nextBackButtonContent = $('<div>', {'class': "alphabet-button-content"})
    var ImageContent          = $('<div>', {'class': "alphabet-image-content"})
    var descriptionContent    = $('<div>', {'class': "alphabet-description-content"})
    var answerContent         = $('<div>', {'class': "alphabet-answer-content"})
    var listenContent         = $('<div>', {'class': "alphabet-listen-content"})
    var audioContent          = $('<div>', {'class': "alphabet-audio-content"})
    var videoContent          = $('<div>', {'class': "alphabet-video-content"})
    var resultContent          = $('<div>', {'class': "alphabet-result-content"})

    
    var nextButton = $('<button>', {'class': "alphabet-next-button"}).html("İleri")
    var backButton = $('<button>', {'class': "alphabet-back-button"}).html("Geri")
    
    $container.append(resultContent);
    nextBackButtonContent.append(nextButton)
    nextBackButtonContent.append(backButton)
    $container.append(nextBackButtonContent);
    $container.append(ImageContent);
    $container.append(descriptionContent);
    $container.append(listenContent);
    $container.append(answerContent);
    $container.append(audioContent);
    $container.append(videoContent);



    nextButton.on("click", function(){
      selectIndex = selectIndex + 1
      setAlphabets(selectIndex)
    })

    backButton.on("click", function(){
      selectIndex = selectIndex - 1
      setAlphabets(selectIndex)
    })
    

    function setNextBackButton(){
      nextBackButtonContent.show()
      backButton.show()
      nextButton.show()

      if (self.options.alphabet.length < 2) {
        nextBackButtonContent.hide()
      }

      if (selectIndex == 0) {
        backButton.hide()
      }
      
      if (selectIndex + 1 == self.options.alphabet.length) {
        nextButton.hide()
      }

    }

    this.$slides = [];
    this.$choices = $('<div>', {
      'class': 'h5p-sc-set h5p-sc-animate'
    });



    var $scoreBar = H5P.JoubelUI.createScoreBar(10, 'This is a scorebar');
    $scoreBar.setScore(5)
    var $button = H5P.JoubelUI.createButton({
      title: 'Retry',
      click: function (event) {
        console.log('Retry was clicked');
      }
    });
    console.log($scoreBar);
    resultContent.html($scoreBar.$scoreBar);

    
    function setAlphabets(index){


      selectIndex = index
      setNextBackButton()

      var alphabet = self.options.alphabet[index]

      //add images
      descriptionContent.html(alphabet.description);
      if (alphabet.image && alphabet.image.path) {
        ImageContent.html($('<img>',{
          class: 'alphabet-image',
          alt: "image alt",
          src: H5P.getPath(alphabet.image.path, id),
          load: function () {
            self.trigger('resize')
          }
        }))
      }

      //sesler
      var audio       = H5P.newRunnable(alphabet.audio, id);
      var audioTrue   = H5P.newRunnable(alphabet.audioTrue, id);
      var audioFalse  = H5P.newRunnable(alphabet.audioFalse, id);
      var video       = H5P.newRunnable(alphabet.video, id);

      var $videoContainer = $('<div>', {'class': 'h5p-video-container'})
      video.on('resize', function(){self.trigger('resize');})
      video.attach($videoContainer);
      videoContent.html($videoContainer);
   

      var $audioContainer = $('<div>', {'class': 'h5p-webinar-quiz'})
  
      audio.on('resize', function(){ self.trigger('resize');})
      audio.attach($audioContainer);
      
   
      var $audioTrueContainer = $('<div>', { 'class': 'h5p-webinar-quiz'})  
      audioTrue.on('resize', function(){self.trigger('resize');})
      audioTrue.attach($audioTrueContainer);


      var $audioFalseContainer = $('<div>', {'class': 'h5p-webinar-quiz'})
      audioFalse.on('resize', function(){self.trigger('resize');})
      audioFalse.attach($audioFalseContainer);


      // Add greeting text.
      var playButton = $('<button>', {
        'class': "answer-play",
        'aria-label': "label?"
      }).html("Başla")
      listenContent.html(playButton)

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

      var falseButton = $('<button>', {
        'class': "answer-button answer-button-false",
        'aria-label': "label?"
      }).html("Yanlış")

      buttonContent.append(trueButton)
      buttonContent.append(falseButton)
      
      answerContent.html(buttonContent)
      
      trueButton.on('click', function(){
        checkAnswer("true")
      })
      
      
      falseButton.on('click', function(){
        checkAnswer("false")
      })
      

      function checkAnswer(selectAnswer){
        playAnswer()
      
        if (selectAnswer == alphabet.correct) {
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

    }
    

    setAlphabets(selectIndex)

    

    
    
  

  };
  
 
  return C;
})(H5P.jQuery);