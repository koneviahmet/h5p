var H5P = H5P || {};

H5P.Alphabet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      alphabet: null,
      generalSettings: {directive: false, mode: "one"}
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
    var is_progress       = false
    var answers           = [];
    var isNextButton      = false
    var whichVideo        = null; //questionVideo, trueVideo, falseVideo
    var whichAudio        = null; //questionAudio, trueAudio, falseAudio
    var audio,audioTrue,audioFalse,video,videoTrue,videoFalse,directiveAudio;

    var directive         = self.options.generalSettings.directive
    var trueVoice         = new Audio(getLibraryPath("true.mp3"));
    var falseVoice        = new Audio(getLibraryPath("false.mp3"));


    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-alphabet");

    var nextBackButtonContent = $('<div>', {'class': "alphabet-button-content"}).hide()
    var directiveButton       = $('<div>', {'class': "alphabet-directive-button"}).html("")
    var mainContent           = $('<div>', {'class': "alphabet-main-content"})
    var resultContent         = $('<div>', {'class': "alphabet-result-content"}).hide()
    var headerContent         = $('<div>', {'class': "alphabet-header-content"}).hide()

    var nextButton            = $('<button>', {'class': "alphabet-next-button"}).html("İleri")
    var backButton            = $('<button>', {'class': "alphabet-back-button"}).html("Geri")
    var restartButton         = $('<button>', {'class': "alphabet-restart-button"}).html("Yeniden Başla")
    var progressContent       = $('<div>', {'class': "alphabet-progress-content"}).hide()
    var progress              = $('<div>', {'class': "alphabet-progress"})
    var progressSpan          = $('<span>', {'class': "alphabet-progress-span"}).html("15")
    progressContent.append(progress.append(progressSpan))





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
    if (directive.params && directive.params.files) {
      $container.append(directiveButton);
    }

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

      directiveButton.show()
      progressContent.show()
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
      directiveButton.hide()
      progressContent.hide()
      mainContent.hide()
      resultContent.show()
      headerContent.show()
      var $scoreBar = H5P.JoubelUI.createScoreBar(self.options.alphabet.length, 'This is a scorebar');
      $scoreBar.setScore(trueScore)
      var table = $('<table>', {'class': "alphabet-result-table"})

      // var newAnswer = {
      //   "index": 1,
      //   "description": "açıklama olacak burada 2",
      //   "correct": "true"
      // }

      // answers.push(newAnswer)


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

    function setProgress(){
      //  progressContent
      //  progress
      //  progressSpan
      var indexSize = self.options.alphabet.length
      var selected = selectIndex + 1
      var percent  = (100 * selected) / indexSize
      progressSpan.html(selected + "/" + indexSize)
      progress.css('width', percent + '%')

    }



    //setalphabets
    function setAlphabets(){
      setNextBackButton()
      whichVideo  = null;
      whichAudio  = null;

      var alphabet          = self.options.alphabet[selectIndex]
      alphabet.mode         = self.options.generalSettings.mode
      alphabet.correct      = alphabet.groupQuestion.correct ? alphabet.groupQuestion.correct : null;
      alphabet.answerOne    = alphabet.groupQuestion.groupModeTwoCorrect ? alphabet.groupQuestion.groupModeTwoCorrect.answerOne : null;
      alphabet.answerTwo    = alphabet.groupQuestion.groupModeTwoCorrect ? alphabet.groupQuestion.groupModeTwoCorrect.answerTwo : null;
      alphabet.answerThree  = alphabet.groupQuestion.groupModeTwoCorrect ? alphabet.groupQuestion.groupModeTwoCorrect.answerThree : null;

      alphabet.description  = alphabet.groupGeneralSettings.description ? alphabet.groupGeneralSettings.description : null;
      alphabet.image        = alphabet.groupQuestion.image ? alphabet.groupQuestion.image : null;
      alphabet.bgImage      = alphabet.groupGeneralSettings.bgImage ? alphabet.groupGeneralSettings.bgImage : null;
      alphabet.audio        = alphabet.groupQuestion.audio ? alphabet.groupQuestion.audio : null;
      alphabet.video        = alphabet.groupQuestion.video ? alphabet.groupQuestion.video : null;

      alphabet.audioTrue    = alphabet.groupTrueAnswer.audioTrue ? alphabet.groupTrueAnswer.audioTrue : null;
      alphabet.videoTrue    = alphabet.groupTrueAnswer.videoTrue ? alphabet.groupTrueAnswer.videoTrue : null;
      alphabet.audioFalse   = alphabet.groupFalseAnswer.audioFalse ? alphabet.groupFalseAnswer.audioFalse : null;
      alphabet.videoFalse   = alphabet.groupFalseAnswer.videoFalse ? alphabet.groupFalseAnswer.videoFalse : null;



      var questionAnswer  = []
      var selectAnswer    = alphabet.mode == "one" ? [] : ["false","false","false"];

      setProgress()

      if (alphabet.mode == "one") {
        questionAnswer.push(alphabet.correct)
        questionAnswer = questionAnswer.join("-")
      }else if (alphabet.mode == "two") {
        questionAnswer.push(alphabet.answerOne ? "true":"false")
        questionAnswer.push(alphabet.answerTwo? "true":"false")
        questionAnswer.push(alphabet.answerThree? "true":"false")
        questionAnswer = questionAnswer.join("-")
      }


      var imageContent          = $('<div>', {'class': "alphabet-image-content-" + alphabet.mode}).hide()
      var bgImageContent        = $('<div>', {'class': "alphabet-bg-image-content-" + alphabet.mode})
      var descriptionContent    = $('<div>', {'class': "alphabet-description-content-" + alphabet.mode}).hide()
      var answerContent         = $('<div>', {'class': "alphabet-answer-content-" + alphabet.mode})
      var checkContent          = $('<div>', {'class': "alphabet-check-content-" + alphabet.mode})
      var videoContent          = $('<div>', {'class': "alphabet-video-content"}).hide()

      var listenContent         = $('<div>', {'class': "alphabet-listen-content-" + alphabet.mode}).hide()
      var audioContent          = $('<div>', {'class': "alphabet-audio-content-" + alphabet.mode}).hide()
      var audioContainer        = $('<div>', {'class': "alphabet-audio-container-" + alphabet.mode}).hide()
      var audioTrueContainer    = $('<div>', {'class': "alphabet-audio-true-container-" + alphabet.mode}).hide()
      var audioFalseContainer   = $('<div>', {'class': "alphabet-audio-false-container-" + alphabet.mode}).hide()
      var videoContainer        = $('<div>', {'class': "alphabet-video-container-" + alphabet.mode}).hide()
      var videoTrueContainer    = $('<div>', {'class': "alphabet-video-true-container-" + alphabet.mode}).hide()
      var videoFalseContainer   = $('<div>', {'class': "alphabet-video-false-container-" + alphabet.mode}).hide()

      var playButton      = $('<div>', {'class': "alphabet-play-button-" + alphabet.mode}).html("")
      var firstButton     = $('<div>', {'class': "alphabet-answer-button alphabet-answer-button-first-" + alphabet.mode}).html("")
      var secondButton    = $('<div>', {'class': "alphabet-answer-button alphabet-answer-button-second-" + alphabet.mode}).html("")
      var threeButton     = $('<div>', {'class': "alphabet-answer-button alphabet-answer-button-three-" + alphabet.mode}).html("")
      var checkButton     = $('<div>', {'class': "alphabet-answer-button alphabet-answer-button-check-" + alphabet.mode}).html("")

      mainContent.html('')
      mainContent.append(imageContent);
      mainContent.append(bgImageContent);
      mainContent.append(descriptionContent);
      mainContent.append(listenContent);
      mainContent.append(answerContent);
      mainContent.append(checkContent);
      mainContent.append(audioContent);
      mainContent.append(videoContent);
      $container.append(mainContent);

      if(is_progress){
        $container.append(progressContent);
      }


      //Başlangıç animasonları
      animate(firstButton, "animate__backInUp")
      animate(secondButton, "animate__backInUp")
      animate(threeButton, "animate__backInUp")

      //add images
      descriptionContent.html(alphabet.description);
      if (alphabet.image && alphabet.image.path) {
        imageContent.show()
        imageContent.html($('<img>',{
          class: 'alphabet-image-'+alphabet.mode,
          src: H5P.getPath(alphabet.image.path, id),
          load: function () {
            //self.trigger('resize')
          }
        }))

        animate(imageContent, "animate__pulse")
      }

      if (alphabet.bgImage && alphabet.bgImage.path) {
        bgImageContent.html($('<img>',{
          class: 'alphabet-bg-image',
          src: H5P.getPath(alphabet.bgImage.path, id),
          load: function () {
            self.trigger('resize')
          }
        }))
      }

      if(self.parent){
        //course presentetion ile kullanıyor demektir.
        bgImageContent.addClass("can_small_cp")
     }


      //sesler
      if (directive.params && directive.params.files) {
          listenContent.show()
          audioContainer.show()

          directiveAudio    = H5P.newRunnable(directive, id);
          //directiveAudio.on('resize', function(){ self.trigger('resize');})
          directiveAudio.attach(audioContainer);
          directiveAudio.audio.addEventListener('play', audioPlayStatus)
          directiveAudio.audio.addEventListener('ended', audioStopStatus)

          directiveAudio.stop()
          directiveButton.on('click', function(){
            directiveAudio.play()
          })
      }else{
        directive = false
      }


      if (alphabet.audio.params && alphabet.audio.params.files) {
          listenContent.show()
          audioContainer.show()
          audio    = H5P.newRunnable(alphabet.audio, id);
          //audio.on('resize', function(){ self.trigger('resize');})
          audio.attach(audioContainer);
          audio.audio.addEventListener('play', audioPlayStatus)
          audio.audio.addEventListener('ended', audioStopStatus)
          audio.stop()
      }else{
        alphabet.audio = false
      }


      if (alphabet.audioTrue.params && alphabet.audioTrue.params.files) {
        audioTrueContainer.show()
        audioTrue = H5P.newRunnable(alphabet.audioTrue, id);
        //audioTrue.on('resize', function(){self.trigger('resize');})
        audioTrue.attach(audioTrueContainer);
        audioTrue.audio.addEventListener('play', audioPlayStatus)
        audioTrue.audio.addEventListener('ended', audioStopStatus)
        audioTrue.stop()
      }else{
        alphabet.audioTrue = false
      }


      if (alphabet.audioFalse.params && alphabet.audioFalse.params.files) {
        audioFalseContainer.show()
        audioFalse = H5P.newRunnable(alphabet.audioFalse, id);
        //audioFalse.on('resize', function(){self.trigger('resize');})
        audioFalse.attach(audioFalseContainer);
        audioFalse.audio.addEventListener('play', audioPlayStatus)
        audioFalse.audio.addEventListener('ended', audioStopStatus)
        audioFalse.stop()
      }else{
        alphabet.audioFalse = false
      }


      videoContent.html("");
      if(alphabet.video.params && alphabet.video.params.sources){
        video  = H5P.newRunnable(alphabet.video, id);
        //video.on('resize', function(){self.trigger('resize');})
        video.attach(videoContainer);
        videoContent.append(videoContainer);
        video.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
        video.pause()
    }else{
        alphabet.video = false
      }


      if(alphabet.videoTrue.params && alphabet.videoTrue.params.sources){
        videoTrue   = H5P.newRunnable(alphabet.videoTrue, id);
        //videoTrue.on('resize', function(){self.trigger('resize');})
        videoTrue.attach(videoTrueContainer);
        videoContent.append(videoTrueContainer);
        videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
        videoTrue.pause()
    }else{
        alphabet.videoTrue = false
      }


      if(alphabet.videoFalse.params && alphabet.videoFalse.params.sources){
        videoFalse  = H5P.newRunnable(alphabet.videoFalse, id);
        //videoFalse.on('resize', function(){self.trigger('resize');})
        videoFalse.attach(videoFalseContainer);
        videoContent.append(videoFalseContainer);
        videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
        videoFalse.pause()
    }else{
        alphabet.videoFalse = false
      }


      //videoTrue.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});
      //videoFalse.on('stateChange', function(e){if (e.data === 0) {videoStopStatus()}else if (e.data === 1){videoPlayStatus()}});


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
      answerContent.append(firstButton)
      answerContent.append(secondButton)

      //eğer mode 2 ise 3. butonu ekle
      if (alphabet.mode == "two") {
        answerContent.append(threeButton)
        checkContent.append(checkButton)
      }

      if (alphabet.mode == "one") {
        firstButton.on('click', function(){
          selectAnswer.push("true");
          checkAnswer()
        })

        secondButton.on('click', function(){
          selectAnswer.push("false");
          checkAnswer()
        })
      }else if (alphabet.mode == "two") {
        firstButton.on('click', function(){
          if(selectAnswer[0] == "true"){
            selectAnswer[0] = "false"
          }else{
            selectAnswer[0] = "true"
          }


          checkActiveButton()
        })

        secondButton.on('click', function(){

          if(selectAnswer[1] == "true"){
            selectAnswer[1] = "false"
          }else{
            selectAnswer[1] = "true"
          }

          checkActiveButton()
        })

        threeButton.on('click', function(){

          if(selectAnswer[2] == "true"){
            selectAnswer[2] = "false"
          }else{
            selectAnswer[2] = "true"
          }

          checkActiveButton()
        })

        checkButton.on('click', function(){
          checkAnswer()
        })

      }


      checkActiveButton()
      function checkActiveButton(){
        if (selectAnswer[0] == "true") {
          firstButton.addClass("active-button-"+alphabet.mode)
        }else{
          firstButton.removeClass("active-button-"+alphabet.mode)
        }

        if (selectAnswer[1] == "true") {
          secondButton.addClass("active-button-"+alphabet.mode)
        }else{
          secondButton.removeClass("active-button-"+alphabet.mode)
        }

        if (selectAnswer[2] == "true") {
          threeButton.addClass("active-button-"+alphabet.mode)
        }else{
          threeButton.removeClass("active-button-"+alphabet.mode)
        }
      }





      /*
      *** cevabı kontrol edelim
      *** cevap için ses ve video var ise önce ses oynasın bitince video oynasın
      *** cevap için sadece ses var ise ses oynasın
      *** cevao için sadece video var ise video oynasın
      */

      function checkAnswer(){
        deActiveButton()
        var bgColor = null
        if (selectAnswer.join("-") == questionAnswer) {
          trueVoice.play()
          animate(imageContent, "animate__heartBeat")
          animate(firstButton, "animate__heartBeat")
          animate(secondButton, "animate__heartBeat")
          animate(threeButton, "animate__heartBeat")
          animate(playButton, "animate__heartBeat")

          bgColor = "#7abe26"
        }else{
          falseVoice.play()

          animate(imageContent, "animate__swing")
          animate(firstButton, "animate__swing")
          animate(secondButton, "animate__swing")
          animate(threeButton, "animate__swing")
          animate(playButton, "animate__swing")

          bgColor = "#EB5353"
        }

        //arkaplana renk atalım
        bgImageContent.css('opacity','0.4');
        $container.css('background', bgColor);
        $container.css('overflow', "hidden");
        setTimeout(function(){
          bgImageContent.css('opacity','1');
          $container.css('background','#fff');
        }, 400);

        setTimeout(function(){
          checkAnswerGet()
        }, 1000);
      }

      function checkAnswerGet(){
        var newAnswer = {
          "index": selectIndex,
          "description": alphabet.description,
        }

        if (selectAnswer.join("-") == questionAnswer) {
          //doğru yaptı demektir
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

        //select answeri boşaltalım
        selectAnswer = alphabet.mode == "one" ? [] : selectAnswer;
      }


      function audioPlayStatus(){
        deActiveButton()
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
          }else{
            setNextAlphabet()
          }
        }

      }


      function videoPlayStatus(){
        //video oynuyorsa görün
        videoContent.show()

        deActiveButton()
      }


      function videoStopStatus(){
        videoContent.hide()
        activeButton()
        if (whichVideo == "questionVideo") {
          if(alphabet.audio){
            audio.play()
            whichAudio = "questionAudio"
          }
        }else if(whichVideo == "trueVideo"){
          setNextAlphabet()
        }else if(whichVideo == "falseVideo"){
          setNextAlphabet()
        }

      }

      function activeButton(){
        playButton.removeClass('de-active-button-'+ alphabet.mode);
        firstButton.removeClass('de-active-button-'+ alphabet.mode);
        secondButton.removeClass('de-active-button-'+ alphabet.mode);
        threeButton.removeClass('de-active-button-'+ alphabet.mode);
        checkButton.removeClass('de-active-button-'+ alphabet.mode);
        directiveButton.removeClass('de-active-button-'+ alphabet.mode);
      }

      function deActiveButton(){
        playButton.addClass('de-active-button-'+ alphabet.mode);
        firstButton.addClass('de-active-button-'+ alphabet.mode);
        secondButton.addClass('de-active-button-'+ alphabet.mode);
        threeButton.addClass('de-active-button-'+ alphabet.mode);
        checkButton.addClass('de-active-button-'+ alphabet.mode);
        directiveButton.addClass('de-active-button-'+ alphabet.mode);
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


    function animate(selected, animate){
      selected.addClass('animate__animated ' + animate).one('mozAnimationEnd webkitAnimationEnd oanimationend MSAnimationEnd animationend', function(){
        $(this).removeClass("animate__animated " + animate)
      })
    }



    if (self.options.alphabet) {
      setAlphabets()
    }
    // showResultContent()

    //truevoice bitti
    // trueVoice.addEventListener('ended', function(){
    //   console.log("bitti");
    // })

    function getLibraryPath(file){
      return self.getLibraryFilePath("sounds/"+file)
    }

  };




  return C;
})(H5P.jQuery);
