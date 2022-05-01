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
    var isAudioShow       = false;
    var isAudioTrueShow   = false;
    var isAudioFalseShow  = false;
    var isVideoShow       = false;
    var isVideoTrueShow   = false;
    var isVideoFalseShow  = false;
    var audio,audioTrue,audioFalse,video,videoTrue,videoFalse;


    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-alphabet");

    var nextBackButtonContent = $('<div>', {'class': "alphabet-button-content"})
    var ImageContent          = $('<div>', {'class': "alphabet-image-content"})
    var descriptionContent    = $('<div>', {'class': "alphabet-description-content"})
    var answerContent         = $('<div>', {'class': "alphabet-answer-content"})
    var videoContent          = $('<div>', {'class': "alphabet-video-content"})
    var resultContent         = $('<div>', {'class': "alphabet-result-content"})
    var listenContent         = $('<div>', {'class': "alphabet-listen-content"})
    var audioContent          = $('<div>', {'class': "alphabet-audio-content"})
    var audioContainer        = $('<div>', {'class': 'alphabet-audio-container'})
    var audioTrueContainer    = $('<div>', {'class': 'alphabet-audio-true-container'})  
    var audioFalseContainer   = $('<div>', {'class': 'alphabet-audio-false-container'})


    var nextButton      = $('<button>', {'class': "alphabet-next-button"}).html("İleri")
    var backButton      = $('<button>', {'class': "alphabet-back-button"}).html("Geri")
    var audioPlayButton = $('<button>', {'class': "alphabet-audio-play-button"}).html("Başla")
    var trueButton      = $('<button>', {'class': "alphabet-answer-button alphabet-answer-button-true"}).html("Doğru")
    var falseButton     = $('<button>', {'class': "alphabet-answer-button alphabet-answer-button-false"}).html("Yanlış")
    var videoPlayButton = $('<button>', {'class': "alphabet-video-play-button"}).html("play")



    $container.append(resultContent);
    nextBackButtonContent.append(nextButton)
    nextBackButtonContent.append(backButton)
    
    $container.append(nextBackButtonContent);
    $container.append(ImageContent);
    $container.append(descriptionContent);
    $container.append(listenContent);
    $container.append(answerContent);
    $container.append(audioContent);
    

    nextBackButtonContent.append(videoPlayButton)
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


    var $scoreBar = H5P.JoubelUI.createScoreBar(10, 'This is a scorebar');
    $scoreBar.setScore(4)
    resultContent.html($scoreBar.$scoreBar);

    //setalphabets
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
      console.log(alphabet.audio);
      audio       = H5P.newRunnable(alphabet.audio, id);
      audioTrue   = H5P.newRunnable(alphabet.audioTrue, id);
      audioFalse  = H5P.newRunnable(alphabet.audioFalse, id);
      video       = H5P.newRunnable(alphabet.video, id);
      videoTrue   = H5P.newRunnable(alphabet.videoTrue, id);
      videoFalse  = H5P.newRunnable(alphabet.videoFalse, id);

      

      video.on('resize', function(){self.trigger('resize');})
      videoTrue.on('resize', function(){self.trigger('resize');})
      videoFalse.on('resize', function(){self.trigger('resize');})
      video.attach(videoContent);
      //videoTrue.attach(videoContent);
      //videoFalse.attach(videoContent);
      

      //videoTrue.attach($videoContainer);
      //videoFalse.attach($videoContainer);

      /** video content push */
      //videoContent.html($videoContainer);
      
      videoPlayButton.on("click", function(){
        video.play()
      })


      video.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});

      

      audio.on('resize', function(){ self.trigger('resize');})
      audio.attach(audioContainer);
      
      audioTrue.on('resize', function(){self.trigger('resize');})
      audioTrue.attach(audioTrueContainer);

      audioFalse.on('resize', function(){self.trigger('resize');})
      audioFalse.attach(audioFalseContainer);

      listenContent.html(audioPlayButton)
      audioPlayButton.on('click', function(){
        audio.play();
      })

      //audio events
      audio.audio.addEventListener('play', audioPlayStatus)
      audio.audio.addEventListener('ended', audioStopStatus)
      audioTrue.audio.addEventListener('play', audioPlayStatus)
      audioTrue.audio.addEventListener('ended', audioStopStatus)
      audioFalse.audio.addEventListener('play', audioPlayStatus)
      audioFalse.audio.addEventListener('ended', audioStopStatus)


      answerContent.html("")
      answerContent.append(trueButton)
      answerContent.append(falseButton)

      trueButton.on('click', function(){
        checkAnswer("true")
      })
      
      falseButton.on('click', function(){
        checkAnswer("false")
      })
      
      function checkAnswer(selectAnswer){
        console.log(selectAnswer, "-", alphabet.correct);
        if (selectAnswer == alphabet.correct) {
          audioTrue.play()
        }else{
          audioFalse.play()
        }
      } 

      function audioPlayStatus(){
        console.log("audio play");
      }
  
      function audioStopStatus(){
        console.log("audio stop");
      }

      function videoPlayStatus(){
        console.log("video start");
      }
  
      function videoStopStatus(){
        console.log("video stop");
      }
    }




    

    setAlphabets(selectIndex)

    


  };
  
 
  return C;
})(H5P.jQuery);