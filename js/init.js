phina.globalize();

const questions = {};
fetch('./js/data.json')
  .then(response => response.json())
  .then(json => Object.assign(questions, json));

const STATIC = {
  SCREEN_SIZE_X: 580,
  SCREEN_SIZE_Y: 960,
  SCREEN_PADDING: 24,
  FPS: 60,
  SUPPORT_EXT: getSupportExt(),
  TRANSITION_WAIT: 250,
  TRANSITION_TYPE: 'easeOutCubic',
  data: {
    soundEnable: false,
    rightCount: 0,
    questionCount: 10,
    nowQuestion: 1,
    timer: 0,
  }
};

const COLOR = {
  BG: '#F8F8FC',
  MAIN: '#12122A',
  ACCENT: '#d63030',
  RIGHT: '#FF1010',
  WRONG: '#1010DD',
}

const SE = {};

const IMAGES = {
    'right': 'assets/image/right.png',
    'wrong': 'assets/image/wrong.png',
}

const SOUNDS = {
    'right': `assets/sound/right.${STATIC.SUPPORT_EXT}`,
    'wrong': `assets/sound/wrong.${STATIC.SUPPORT_EXT}`,
    'fanfare': `assets/sound/fanfare.${STATIC.SUPPORT_EXT}`,
}

const MINIMUM_ASSETS = {
  image: IMAGES,
  sound: {},
  font: {},
};

const MAXIMUM_ASSETS = {
  image:IMAGES,
  sound: SOUNDS,
};

const SCENES = [
  {
    label: 'title',
    className: 'TitleScene',
    nextLabel: 'main'
  },
  {
    label: "main",
    className: "MainScene",
    nextLabel: "result"
  },
  {
    label: "result",
    className: "ResultScene",
    nextLabel: "title"
  },
];

phina.define('LoadingScene', {
  superClass: 'DisplayScene',

  init: function (options) {
    this.superInit(options);
    this.backgroundColor = COLOR.BG;

    this.mainGroup = DisplayElement().addChildTo(this)
      .setPosition(0, 0);
    this.overlayGroup = DisplayElement().addChildTo(this);

    Label({
      text: '音声をロードして遊びますか？', fill: COLOR.MAIN, fontSize: 24,
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center(-2));

    // 音声あり
    RectangleShape({
      height: 64, width: 256, cornerRadius: 10, fill: COLOR.MAIN, strokeWidth: 0
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center())
      .setInteractive(true)
      .on('pointstart', () => {
        STATIC.data.soundEnable = true;
        this.nextScene(MAXIMUM_ASSETS);
      });
    Label({
      text: '音声あり', fill: COLOR.BG, fontSize: 24,
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center());

    // 音声なし
    RectangleShape({
      height: 64, width: 256, cornerRadius: 10, fill: COLOR.MAIN, strokeWidth: 0
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center(2))
      .setInteractive(true)
      .on('pointstart', () => {
        this.nextScene(MINIMUM_ASSETS);
      });
    Label({
      text: '音声なし', fill: COLOR.BG, fontSize: 24,
    }).addChildTo(this.mainGroup)
      .setPosition(this.gridX.center(), this.gridY.center(2));
  },
  nextScene: function(assets) {
    const loader = phina.asset.AssetLoader();
    loader.onload = () => {
      this.flare('loaded');
    };
    this.mainGroup.tweener
      .to({x: -STATIC.SCREEN_SIZE_X, y:0}, STATIC.TRANSITION_WAIT, STATIC.TRANSITION_TYPE)
      .call(()=>{
        loader.load(assets);
      })
      .play();
  }
});

phina.main(function () {
  const app = GameApp({
    query: 'canvas',
    startLabel: 'title',
    fit: true,
    assets: MINIMUM_ASSETS,
    width: STATIC.SCREEN_SIZE_X,
    height: STATIC.SCREEN_SIZE_Y,
    scenes: SCENES,
    fps: STATIC.FPS,
  });
  app.run();
});

function getSupportExt() {
  const audio = new Audio();
  if (audio.canPlayType("audio/mp3") === "maybe") {
    return "mp3"
  } else if (audio.canPlayType("audio/ogg") === "maybe") {
    return "ogg"
  } else if (audio.canPlayType("audio/wav") === "maybe") {
    return "wav"
  }
  return "";
}