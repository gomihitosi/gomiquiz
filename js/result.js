
phina.define('ResultScene', {
  superClass: 'DisplayScene',
  init: function (option) {
    this.superInit(option);
    this.backgroundColor = COLOR.BG;

    const achievement = ["って誰？", "を知ってる", "ニワカ", "素人", "フォロワー", "ファン", "玄人", "推し", "博士", "Wikipedia", "神"];
    const index = Math.floor((STATIC.data.rightCount / STATIC.data.questionCount) * 10) / 10 * 10;　
    const result = "吾味人美" + achievement[index];

    Label({
      text: '結果発表', fontSize: 36, align: 'center', fill: COLOR.MAIN,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(2));

    Label({
      text: STATIC.data.rightCount + '/' + STATIC.data.questionCount, fontSize: 120, fill: COLOR.MAIN, align: 'center',
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(4));

    Label({
      text: 'あなたの吾味人美度は…', fontSize: 28, align: 'center', fill: COLOR.MAIN,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(7));

    Label({
      text: result, fontSize: 48,align: 'center', fill: COLOR.MAIN,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.center());

    this.twitterBox = new RectangleShape({
      fill: COLOR.MAIN,
      width: 240, height: 80,
      strokeWidth: 0,
      cornerRadius: 8,
    }).addChildTo(this)
      .setInteractive(true)
      .setPosition(this.gridX.center(), this.gridY.center(3))
    this.twitterBox.onclick = function () {
      var text = `吾味人美クイズで${STATIC.data.questionCount}問中${STATIC.data.rightCount}問正解したよ！吾味人美度は「${result}」でした。`
      var url = Twitter.createURL({
        text: text,
        hashtags: '吾味人美クイズ',
        url: location.href,
      });
      window.open(url, 'share window', 'width=480, height=320');
    };
    Label({
      text: 'つぶやく', fontSize: 38, align: 'center', fill: COLOR.BG,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.center(3))

    this.twitterBox = new RectangleShape({
      fill: COLOR.MAIN,
      width: 240, height: 80,
      strokeWidth: 0,
      cornerRadius: 8,
    }).addChildTo(this)
      .setInteractive(true)
      .setPosition(this.gridX.center(), this.gridY.center(5))
      .on('pointstart', () => {
        this.exit()
      });
    Label({
      text: 'タイトルへ', fontSize: 38, align: 'center', fill: COLOR.BG,
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.center(5))

  },
  update: function (app) {
    if (app.keyboard.getKey('space')) {
      this.exit()
    }
  }
});
