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
    var self              = this
    var id                = this.id
    var selectIndex       = 0;
    var trueScore         = 0;
    var answers           = [];
    var isNextButton      = false
    var whichVideo        = null; //questionVideo, trueVideo, falseVideo
    var whichAudio        = null; //questionAudio, trueAudio, falseAudio       
    var audio,audioTrue,audioFalse,video,videoTrue,videoFalse;
    

    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-alphabet");

    var nextBackButtonContent = $('<div>', {'class': "alphabet-button-content"}).hide()
    var mainContent           = $('<div>', {'class': "alphabet-main-content"})
    var resultContent         = $('<div>', {'class': "alphabet-result-content"}).hide()
    var headerContent         = $('<div>', {'class': "alphabet-header-content"}).hide()

    var nextButton            = $('<button>', {'class': "alphabet-next-button"}).html("İleri")
    var backButton            = $('<button>', {'class': "alphabet-back-button"}).html("Geri")
    var restartButton         = $('<button>', {'class': "alphabet-restart-button"}).html("Yeniden Başla")


    restartButton.on("click", function(){
      answers           = [];
      trueScore         = 0
      selectIndex       = 0
      mainContent.show()
      resultContent.hide()
      headerContent.hide()
      setAlphabets()
    })


    headerContent.append(restartButton)
    $container.append(headerContent);

    nextBackButtonContent.append(nextButton)
    nextBackButtonContent.append(backButton)

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
      if(isNextButton){
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
    }

    function showResultContent(){
      nextBackButtonContent.hide()
      mainContent.hide()
      resultContent.show()
      headerContent.show()
      var $scoreBar = H5P.JoubelUI.createScoreBar(self.options.alphabet.length, 'This is a scorebar');
      $scoreBar.setScore(trueScore)
      var table = $('<table>', {'class': "alphabet-result-table"})
      
      for(var i = 0; i < answers.length; i++){
        var correct = answers[i].correct ? "Doğru" : "Yanlış";
        var tr = $('<tr>', {'class': "alphabet-result-table-tr"})
        tr.append('<td>'+answers[i].description+'</td><td>'+correct+'</td>')
        table.append(tr)
      }
      

      resultContent.html("");
      resultContent.append(table);
      resultContent.append($scoreBar.$scoreBar);
    }


    //setalphabets
    function setAlphabets(){
      setNextBackButton()
      whichVideo  = null;
      whichAudio  = null; 

      var alphabet = self.options.alphabet[selectIndex]
      
      var imageContent          = $('<div>', {'class': "alphabet-image-content-" + alphabet.style}).hide()
      var bgImageContent        = $('<div>', {'class': "alphabet-bg-image-content-" + alphabet.style}).hide()
      var descriptionContent    = $('<div>', {'class': "alphabet-description-content-" + alphabet.style}).hide()
      var answerContent         = $('<div>', {'class': "alphabet-answer-content-" + alphabet.style})
      var videoContent          = $('<div>', {'class': "alphabet-video-content-" + alphabet.style}).hide()
      
      var listenContent         = $('<div>', {'class': "alphabet-listen-content-" + alphabet.style}).hide()
      var audioContent          = $('<div>', {'class': "alphabet-audio-content-" + alphabet.style}).hide()
      var audioContainer        = $('<div>', {'class': "alphabet-audio-container-" + alphabet.style}).hide()
      var audioTrueContainer    = $('<div>', {'class': "alphabet-audio-true-container-" + alphabet.style}).hide()  
      var audioFalseContainer   = $('<div>', {'class': "alphabet-audio-false-container-" + alphabet.style}).hide()
      var videoContainer        = $('<div>', {'class': "alphabet-video-container-" + alphabet.style}).hide()
      var videoTrueContainer    = $('<div>', {'class': "alphabet-video-true-container-" + alphabet.style}).hide()  
      var videoFalseContainer   = $('<div>', {'class': "alphabet-video-false-container-" + alphabet.style}).hide()
  
      var playButton      = $('<button>', {'class': "alphabet-play-button-" + alphabet.style}).html("Başla")
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
        imageContent.show()
        imageContent.html($('<img>',{
          class: 'alphabet-image-'+alphabet.style,
          src: H5P.getPath(alphabet.image.path, id),
          load: function () {
            self.trigger('resize')
          }
        }))
      }

      if (alphabet.bgImage && alphabet.bgImage.path) {
        bgImageContent.show()
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
          listenContent.show()
          audioContainer.show()
          audio    = H5P.newRunnable(alphabet.audio, id);
          audio.on('resize', function(){ self.trigger('resize');})
          audio.attach(audioContainer);
          audio.audio.addEventListener('play', audioPlayStatus)
          audio.audio.addEventListener('ended', audioStopStatus)
      }


      if (alphabet.audioTrue) {
        audioTrueContainer.show()
        audioTrue = H5P.newRunnable(alphabet.audioTrue, id);
        audioTrue.on('resize', function(){self.trigger('resize');})
        audioTrue.attach(audioTrueContainer);
        audioTrue.audio.addEventListener('play', audioPlayStatus)
        audioTrue.audio.addEventListener('ended', audioStopStatus)
      }
      

      if (alphabet.audioFalse) {
        audioFalseContainer.show()
        audioFalse = H5P.newRunnable(alphabet.audioFalse, id);
        audioFalse.on('resize', function(){self.trigger('resize');})
        audioFalse.attach(audioFalseContainer);
        audioFalse.audio.addEventListener('play', audioPlayStatus)
        audioFalse.audio.addEventListener('ended', audioStopStatus)
      }
      

      videoContent.html("");
      if(alphabet.video){
        videoContent.show()
        videoContainer.show()
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


      videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});


      /* 
      *** video var ise videoyu başlatıyor
      *** video ve ses var ise önce videoyu, video bitince sesi başlatıyor.
      *** sadece ses var ise sesi başlatıyor.
      *** bu kısımda öncelik video da
      */
      
      listenContent.html(playButton)
      playButton.on('click', function(){
        if (alphabet.video) {
          video.play()
          whichVideo = "questionVideo"
          videoContainer.show()
          videoTrueContainer.hide()
          videoFalseContainer.hide()
        }else{
          if(alphabet.audio){
            audio.play()
            whichAudio = "questionAudio"
          }
        }
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

 


      /* 
      *** cevabı kontrol edelim
      *** cevap için ses ve video var ise önce ses oynasın bitince video oynasın
      *** cevap için sadece ses var ise ses oynasın
      *** cevao için sadece video var ise video oynasın
      */
      function checkAnswer(selectAnswer){
        var newAnswer = {
          "index": selectIndex,
          "description": alphabet.description,
        }
       
        if (selectAnswer == alphabet.correct) {
          if (alphabet.audioTrue) {
            audioTrue.play()
            whichAudio = "trueAudio"
          } else if(!alphabet.audioTrue && alphabet.videoTrue){
            videoTrue.play()
            whichVideo = "trueVideo"
            videoContainer.hide()
            videoTrueContainer.show()
            videoFalseContainer.hide()
          }

          newAnswer.correct = true;
        }else{
          if(alphabet.audioFalse){ 
            audioFalse.play()
            whichAudio = "falseAudio"
          }else if(!alphabet.audioFalse && alphabet.videoFalse){
            videoFalse.play()
            whichVideo = "falseVideo"
            videoContainer.hide()
            videoTrueContainer.hide()
            videoFalseContainer.show()
          }
          
          newAnswer.correct = false;
        }
      
        if (findIndex(selectIndex,answers) === -1) {
          if (newAnswer.correct) {
            trueScore = trueScore + 1
          }
            
          answers.push(newAnswer)
        }

        
      } 


      function audioPlayStatus(){
        deActiveButton()
        console.log("audio play");
      }
  


      function audioStopStatus(){
        activeButton()
        if(whichAudio == "trueAudio"){
          if(alphabet.videoTrue){
            videoContainer.hide()
            videoFalseContainer.hide()
            videoTrueContainer.show()
            videoTrue.play()
            whichVideo = "trueVideo"
          }else{
            //sesten sonra video yok ise bir sonraki soruya geç
            setNextAlphabet()
          }

        }else if(whichAudio == "falseAudio"){
          if(alphabet.videoFalse){
            videoContainer.hide()
            videoTrueContainer.hide()
            videoFalseContainer.show()
            videoFalse.play()
            whichVideo = "falseVideo"
          }
        }

        console.log("audio stop");
      }


      function videoPlayStatus(){
        deActiveButton()
        console.log("video start");
      }
  

      function videoStopStatus(){
        activeButton()
        if (whichVideo == "questionVideo") {
          if(alphabet.audio){
            audio.play()
            whichAudio = "questionAudio"
          }
        }else if(whichVideo == "trueVideo"){
          setNextAlphabet()
        }

        console.log("video stop");
      }



      function activeButton(){
        playButton.removeClass('de-active-button');
        trueButton.removeClass('de-active-button');
        falseButton.removeClass('de-active-button');
      }

      function deActiveButton(){
        playButton.addClass('de-active-button');
        trueButton.addClass('de-active-button');
        falseButton.addClass('de-active-button');
      }


      function setNextAlphabet(){
        selectIndex = selectIndex + 1
        if (selectIndex < self.options.alphabet.length) {
          setAlphabets()
        }else{
          showResultContent()
        }
        
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