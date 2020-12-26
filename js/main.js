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
      fontSize: 48,
      text: STATIC.data.nowQuestion + '/' + STATIC.data.questionCount,
      fill: COLOR.MAIN,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.span(1));

    this.questionShape = RectangleShape({
      height: 400,
      width: STATIC.SCREEN_SIZE_X,
      fill: COLOR.BG,
      stroke: COLOR.MAIN,
      strokeWidth: 4,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(-3));

    this.questionLabel = Label({
      width: 128,
      text: '',
      fill: COLOR.MAIN,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(-3));

    this.answerObjectList = [];
    for (var i = 0; i < 4; i++) {
      const answerButton = RectangleShape({
        height: 80,
        width: STATIC.SCREEN_SIZE_X,
        fill: COLOR.MAIN,
        strokeWidth: 0,
      })
        .addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(i * 1.6 + 2))
        .setInteractive(true)
        .on("pointstart", function () {
          console.log('test');
        });

      const answerLabel = Label({
        fontSize: 24,
        text: '',
        fill: COLOR.BG,
      })
        .addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(i * 1.6 + 2));

      this.answerObjectList.push({button: answerButton, label: answerLabel});
    }

    this.rightLabel = Label({
      fontSize: 180,
      text: '◯',
      fontWeight: '900',
      fill: COLOR.RIGHT,
      stroke: COLOR.BG,
      strokeWidth: 8,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(0));
    this.rightLabel.alpha = 0;

    this.wrongLabel = Label({
      fontSize: 120,
      text: '✕',
      fontWeight: '900',
      fill: COLOR.WRONG,
      stroke: COLOR.BG,
      strokeWidth: 8,
      alpha: 0,
    })
      .addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(0), this.gridY.center(0));
    this.wrongLabel.alpha = 0;

    this.nextQuestion();
  },
  nextQuestion: function () {
    const questionIndex = Math.floor(Math.random() * this.questionDataList.length);
    const questionData = this.questionDataList[questionIndex];
    const rightText = questionData.answer[0];

    this.questionDataList.splice(questionIndex, 1);

    // 15文字で改行
    this.questionLabel.text = questionData.text.match(/.{1,15}/g).join('\n');

    this.answerObjectList = shuffle(this.answerObjectList);
    this.answerObjectList.forEach((answer, index)=>{
      const answerText = questionData.answer[index];
      answer.label.text = answerText;

      answer.button.clear('pointstart')
      answer.button.on("pointstart", (e)=> {
          this.answer(answerText === rightText, e);
        });
    })
  },
  answer: function(isLong, event) {
    let targetLabel;
  
    this.rightLabel.tweener.clear();
    this.wrongLabel.tweener.clear();
    this.rightLabel.alpha = 0;
    this.wrongLabel.alpha = 0;

    if(STATIC.data.soundEnable) {
      SE.right.stop();
      SE.wrong.stop();
    }

    if(isLong) {
      STATIC.data.rightCount++;
      targetLabel = this.rightLabel;
      if(STATIC.data.soundEnable) {
        SE.right.play();
      }
    } else {
      targetLabel = this.wrongLabel;
      if(STATIC.data.soundEnable) {
        SE.wrong.play();
      }
    }

    const wait = 15;
    targetLabel.tweener
      .fadeIn(1).wait(wait).fadeOut(1)
      .fadeIn(1).wait(wait).fadeOut(1)
      .fadeIn(1).wait(wait).fadeOut(1)
      .fadeIn(1).wait(wait).fadeOut(1)
      .fadeIn(1).wait(wait).fadeOut(1).play();

    STATIC.data.nowQuestion++;
    if(STATIC.data.nowQuestion > STATIC.data.questionCount) {
      this.nextScene();
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