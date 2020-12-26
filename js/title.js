phina.define('TitleScene', {
  superClass: 'DisplayScene',
  init: function (option) {
    this.superInit(option);

    // タイトル
    new Label({
      text: '吾味人美\nクイズ',
      fill: COLOR.MAIN,
      fontSize: 96,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.center(-3));

    // スタートボタン
    const questionCountList = [10, 53, questions.data.length];
    questionCountList.forEach((count, index) => {
      RectangleShape({
        width: 240, height: 80,
        cornerRadius: 10,
        fill: COLOR.MAIN,
        strokeWidth: 0
      }).addChildTo(this)
        .setPosition(this.gridX.center(), this.gridY.center(index + 1) + index * 80)
        .setInteractive(true)
        .on('pointstart', () => {
          STATIC.data.questionCount = count;
          this.exit()
        });
      Label({
        text: count + '問',
        width: 128,
        fill: COLOR.BG,
      }).addChildTo(this)
        .setPosition(this.gridX.center(), this.gridY.center(index + 1) + index * 80)
    });

    new Label({
      text: 'ver 0.01',
      fontSize: 38,
      fill: COLOR.MAIN,
      align: 'left',
    }).addChildTo(this)
      .setPosition(this.gridX.span(0) + 4, this.gridY.span(0) + 16);

    new Label({
      text: '効果音: Otologic様 https://otologic.jp/',
      fontSize: 24,
      fill: COLOR.MAIN,
      align: 'left',
    }).addChildTo(this)
      .setPosition(this.gridX.span(0) + 4, this.gridY.span(16) - 16);
  },
});
