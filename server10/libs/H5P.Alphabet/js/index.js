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
    var trueScore   = 0;
    var answers     = [];
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
    var mainContent           = $('<div>', {'class': "alphabet-main-content"})
    var resultContent         = $('<div>', {'class': "alphabet-result-content"})

    var nextButton            = $('<button>', {'class': "alphabet-next-button"}).html("İleri")
    var backButton            = $('<button>', {'class': "alphabet-back-button"}).html("Geri")
    var videoPlayButton       = $('<button>', {'class': "alphabet-video-play-button"}).html("play")


    nextBackButtonContent.append(nextButton)
    nextBackButtonContent.append(backButton)
    nextBackButtonContent.append(videoPlayButton)

    $container.append(resultContent);
    $container.append(nextBackButtonContent);
     
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

    function showResultContent(){
      var $scoreBar = H5P.JoubelUI.createScoreBar(self.options.alphabet.length, 'This is a scorebar');
      $scoreBar.setScore(trueScore)
      var table = $('<table>', {'class': "alphabet-result-table"})
      var tr = $('<tr>', {'class': "alphabet-result-table-tr"})

      tr.append('<td>1</td><td>2</td>')
      table.append(tr)

      resultContent.append(table);
      resultContent.append($scoreBar.$scoreBar);
    }

    showResultContent()

    //setalphabets
    function setAlphabets(){
      setNextBackButton()
      var alphabet = self.options.alphabet[selectIndex]
      
      var imageContent          = $('<div>', {'class': "alphabet-image-content-" + alphabet.style})
      var bgImageContent        = $('<div>', {'class': "alphabet-bg-image-content-" + alphabet.style})
      var descriptionContent    = $('<div>', {'class': "alphabet-description-content-" + alphabet.style})
      var answerContent         = $('<div>', {'class': "alphabet-answer-content-" + alphabet.style})
      var videoContent          = $('<div>', {'class': "alphabet-video-content-" + alphabet.style})
      
      var listenContent         = $('<div>', {'class': "alphabet-listen-content-" + alphabet.style})
      var audioContent          = $('<div>', {'class': "alphabet-audio-content-" + alphabet.style})
      var audioContainer        = $('<div>', {'class': "alphabet-audio-container-" + alphabet.style})
      var audioTrueContainer    = $('<div>', {'class': "alphabet-audio-true-container-" + alphabet.style})  
      var audioFalseContainer   = $('<div>', {'class': "alphabet-audio-false-container-" + alphabet.style})
      var videoContainer        = $('<div>', {'class': "alphabet-video-container-" + alphabet.style})
      var videoTrueContainer    = $('<div>', {'class': "alphabet-video-true-container-" + alphabet.style})  
      var videoFalseContainer   = $('<div>', {'class': "alphabet-video-false-container-" + alphabet.style})
  

      var audioPlayButton = $('<button>', {'class': "alphabet-audio-play-button-" + alphabet.style}).html("Başla")
      var trueButton      = $('<button>', {'class': "alphabet-answer-button alphabet-answer-button-true-" + alphabet.style}).html("Doğru")
      var falseButton     = $('<button>', {'class': "alphabet-answer-button alphabet-answer-button-false-" + alphabet.style}).html("Yanlış")
      

      mainContent.html('')
      mainContent.append(imageContent);
      mainContent.append(bgImageContent);
      mainContent.append(descriptionContent);
      mainContent.append(listenContent);
      mainContent.append(answerContent);
      mainContent.append(audioContent);
      mainContent.append(videoContent);
      $container.append(mainContent);

      
      //add images
      descriptionContent.html(alphabet.description);
      if (alphabet.image && alphabet.image.path) {
        imageContent.html($('<img>',{
          class: 'alphabet-image-'+alphabet.style,
          src: H5P.getPath(alphabet.image.path, id),
          load: function () {
            self.trigger('resize')
          }
        }))
      }

      if (alphabet.bgImage && alphabet.bgImage.path) {
        bgImageContent.html($('<img>',{
          class: 'alphabet-bg-image-'+alphabet.style,
          src: H5P.getPath(alphabet.bgImage.path, id),
          load: function () {
            self.trigger('resize')
          }
        }))
      }
      
      //sesler
      if (alphabet.audio) { 
          audio    = H5P.newRunnable(alphabet.audio, id);
          audio.on('resize', function(){ self.trigger('resize');})
          audio.attach(audioContainer);
          audio.audio.addEventListener('play', audioPlayStatus)
          audio.audio.addEventListener('ended', audioStopStatus)
      }

      if (alphabet.audioTrue) {
        audioTrue = H5P.newRunnable(alphabet.audioTrue, id);
        audioTrue.on('resize', function(){self.trigger('resize');})
        audioTrue.attach(audioTrueContainer);
        audioTrue.audio.addEventListener('play', audioPlayStatus)
        audioTrue.audio.addEventListener('ended', audioStopStatus)
      }
      

      if (alphabet.audioFalse) {
        audioFalse = H5P.newRunnable(alphabet.audioFalse, id);
        audioFalse.on('resize', function(){self.trigger('resize');})
        audioFalse.attach(audioFalseContainer);
        audioFalse.audio.addEventListener('play', audioPlayStatus)
        audioFalse.audio.addEventListener('ended', audioStopStatus)
      }
      
      videoContent.html("");
      if(alphabet.video){
        video   = H5P.newRunnable(alphabet.video, id);
        video.on('resize', function(){self.trigger('resize');})
        video.attach(videoContainer);
        videoContent.append(videoContainer);
        video.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      }

      if(alphabet.videoTrue){
        videoTrue   = H5P.newRunnable(alphabet.videoTrue, id);
        videoTrue.on('resize', function(){self.trigger('resize');})
        videoTrue.attach(videoTrueContainer);
        videoContent.append(videoTrueContainer);
        videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      }
      

      if(alphabet.videoFalse){
        videoFalse  = H5P.newRunnable(alphabet.videoFalse, id);
        videoFalse.on('resize', function(){self.trigger('resize');})
        videoFalse.attach(videoFalseContainer);
        videoContent.append(videoFalseContainer);
        videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      }


      videoPlayButton.on("click", function(){
        video.play()
      })


      videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});


      listenContent.html(audioPlayButton)
      audioPlayButton.on('click', function(){
        audio.play();
      })


      //audio events
      answerContent.html("")
      answerContent.append(trueButton)
      answerContent.append(falseButton)

      trueButton.on('click', function(){
        checkAnswer("true")
      })
      
      falseButton.on('click', function(){
        checkAnswer("false")
      })


      //check answer true or false  
      function checkAnswer(selectAnswer){
        var newAnswer = {
          "index": selectIndex,
          "description": alphabet.description,
        }
       
        if (selectAnswer == alphabet.correct) {
          audioTrue.play()
          newAnswer.correct = true;
        }else{
          audioFalse.play()
          newAnswer.correct = false;
        }
      
        if (findIndex(selectIndex,answers) === -1) {
          if (newAnswer.correct) {
            trueScore = trueScore + 1
          }
            
          answers.push(newAnswer)
        }

        console.log(answers);
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



    var findIndex = function(key,arr) {
      for(var i=0, j=arr.length; i<j; i++) {
          if(arr[i].index === key) {
              return i;
          }
      }
      return -1;
    }
    
    

    setAlphabets()


  };
  
 
  return C;
})(H5P.jQuery);