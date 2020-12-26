phina.define('TitleScene', {
  superClass: 'DisplayScene',
  init: function (option) {
    this.superInit(option);
    this.backgroundColor = COLOR.BG;

    if(STATIC.data.soundEnable) {
      SE["right"] = AssetManager.get("sound", "right");
      SE["wrong"] = AssetManager.get("sound", "wrong");
    }

    const mainGroupX = option.leftIn ? -STATIC.SCREEN_SIZE_X : STATIC.SCREEN_SIZE_X;
    this.mainGroup = DisplayElement().addChildTo(this)
      .setPosition(mainGroupX, 0);
    this.mainGroup.tweener
      .to({x: 0, y:0}, STATIC.TRANSITION_WAIT, STATIC.TRANSITION_TYPE)
      .play();
    this.overlayGroup = DisplayElement().addChildTo(this);

    // タイトル
    new Label({
      text: '吾味人美\nクイズ',
      fill: COLOR.MAIN,
      fontSize: 96,
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center(-3));

    // スタートボタン
    const questionCountList = [10, 53, questions.data.length];
    questionCountList.forEach((count, index) => {
      RectangleShape({
        width: 240, height: 80,
        cornerRadius: 10,
        fill: COLOR.MAIN,
        strokeWidth: 0
      }).addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(index + 1) + index * 80)
        .setInteractive(true)
        .on('pointstart', () => {
          STATIC.data.questionCount = count;
          this.nextScene()
        });
      Label({
        text: count + '問',
        width: 128,
        fill: COLOR.BG,
      }).addChildTo(this.mainGroup)
        .setPosition(this.gridX.center(), this.gridY.center(index + 1) + index * 80)
    });

    // iPhone対応
    document.getElementById('canvas').addEventListener('touchstart', (e) => {
      for(let key in SE){
        SE[key].volume = 0;
        SE[key].play();
        SE[key].stop();
        SE[key].volume = 0.2;
      }
    });

    new Label({
      text: 'version ' + questions.version,
      fontSize: 24,
      fill: COLOR.MAIN,
      align: 'left',
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.span(0) + 8, this.gridY.span(0) + 16);

    new Label({
      text: '効果音: Otologic様 https://otologic.jp/',
      fontSize: 24,
      fill: COLOR.MAIN,
      align: 'left',
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.span(0) + 4, this.gridY.span(16) - 16);
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
