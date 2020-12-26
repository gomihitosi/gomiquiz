phina.define("MainScene", {
  superClass: "DisplayScene",
  init: function (option) {
    this.superInit(option);
    this.backgroundColor = COLOR.BG;

    this.mainGroup = DisplayElement().addChildTo(this)
      .setPosition(STATIC.SCREEN_SIZE_X, 0);
    this.mainGroup.tweener
      .to({x: 0, y:0}, STATIC.TRANSITION_WAIT, STATIC.TRANSITION_TYPE)
      .play();
    this.overlayGroup = DisplayElement().addChildTo(this);
    this.questionDataList = questions.data.slice();

    STATIC.data.rightCount = 0;
    STATIC.data.nowQuestion = 1;
    this.questionCountLabel = Label({
      fontSize: 36,
      text: STATIC.data.nowQuestion + '/' + STATIC.data.questionCount,
      fill: COLOR.MAIN,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.span(0.5));

    this.questionShape = RectangleShape({
      height: 400,
      width: STATIC.SCREEN_SIZE_X,
      fill: COLOR.BG,
      stroke: COLOR.MAIN,
      strokeWidth: 4,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(-3.5));

    this.questionLabelArea = LabelArea({
      width: STATIC.SCREEN_SIZE_X - STATIC.SCREEN_PADDING,
      text: '',
      fill: COLOR.MAIN,
      verticalAlign: 'center',
      align: 'center',
      baseline: 'middle',
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(-3.5));

    this.answerObjectList = [];
    for (var i = 0; i < 4; i++) {
      const answerButton = RectangleShape({
        height: 90,
        width: STATIC.SCREEN_SIZE_X,
        fill: COLOR.MAIN,
        strokeWidth: 0,
      })
        .addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(i * 1.8) + 78)
        .setInteractive(true)
        .on("pointstart", function () {
          console.log('test');
        });

      const answerLabelArea = LabelArea({
        height: 90,
        width: STATIC.SCREEN_SIZE_X - STATIC.SCREEN_PADDING,
        fontSize: 28,
        text: '',
        fill: COLOR.BG,
        verticalAlign: 'center',
        align: 'center',
        baseline: 'middle',
      })
        .addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(i * 1.8) + 78)

      this.answerObjectList.push({button: answerButton, labelArea: answerLabelArea});
    }

    this.rightSprite = Sprite("right")
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center());
    this.rightSprite.alpha = 0;

    this.wrongSprite = Sprite("wrong")
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center());
    this.wrongSprite.alpha = 0;

    this.nextQuestion();
  },
  nextQuestion: function () {
    const questionIndex = Math.floor(Math.random() * this.questionDataList.length);
    const questionData = this.questionDataList[questionIndex];
    const rightText = questionData.answer[0];

    this.questionDataList.splice(questionIndex, 1);
    this.questionLabelArea.text = questionData.text;

    this.answerObjectList = shuffle(this.answerObjectList);
    this.answerObjectList.forEach((answer, index)=>{
      const answerText = questionData.answer[index];
      answer.labelArea.text = answerText;

      answer.button.clear('pointstart')
      answer.button.on("pointstart", (e)=> {
          this.answer(answerText === rightText, e);
        });
    })
  },
  answer: function(isLong, event) {
    let targetSprite;
  
    this.rightSprite.tweener.clear();
    this.wrongSprite.tweener.clear();
    this.rightSprite.alpha = 0;
    this.wrongSprite.alpha = 0;

    if(STATIC.data.soundEnable) {
      SE.right.stop();
      SE.wrong.stop();
    }

    if(isLong) {
      STATIC.data.rightCount++;
      targetSprite = this.rightSprite;
      if(STATIC.data.soundEnable) {
        SE.right.play();
      }
    } else {
      targetSprite = this.wrongSprite;
      if(STATIC.data.soundEnable) {
        SE.wrong.play();
      }
    }

    const shortWait = 15;
    const longWait = 60;
    targetSprite.tweener
      .fadeIn(shortWait).wait(longWait).fadeOut(shortWait)
      .fadeIn(shortWait).wait(longWait).fadeOut(shortWait)
      .fadeIn(shortWait).wait(longWait).fadeOut(shortWait)
      .fadeIn(shortWait).wait(longWait).fadeOut(shortWait)
      .fadeIn(shortWait).wait(longWait).fadeOut(shortWait).play();

    STATIC.data.nowQuestion++;
    if(STATIC.data.nowQuestion > STATIC.data.questionCount) {
      this.nextScene();
      return;
    }
    this.questionCountLabel.text = STATIC.data.nowQuestion + '/' + STATIC.data.questionCount;
    this.nextQuestion();
  },
  nextScene: function() {
    this.mainGroup.tweener
      .to({x: -STATIC.SCREEN_SIZE_X, y:0}, STATIC.TRANSITION_WAIT, STATIC.TRANSITION_TYPE)
      .call(()=>{
        this.exit();
      })
      .play();
  }
});

function shuffle (array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}