/**
 * TextAlive App API lyric sheet example
 * https://github.com/TextAliveJp/textalive-app-lyric-sheet
 *
 * インタラクティブな歌詞カードを実装した TextAlive App API のサンプルコードです。
 * 発声にあわせて歌詞が表示され、歌詞をクリックするとそのタイミングに再生がシークします。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 */
// APIキーとエンドポイントを設定
const API_KEY = "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"; // ←ご自身のAPIキーに置き換えてください
const API_URL = "https://api.perplexity.ai/chat/completions"; // Perplexity API

// 背景切り替えinterval
const interval = [23000,11000,10000,12000,11000,
                  22000,  13000,30000,11000,12000,11000,31000,0
]  

async function getAIReply() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        { role: "user", content: "ジャイアン(1)とのび太(2)はどっちが強いか。余計な文字は一切入れずに、「12」とか「21」とかだけで返してください" }
      ]
    })
  });
  const data = await response.json();


  // レスポンス構造に応じて返答を取得
  /*if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content;
  } else if (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) {
    return data.output[0].content[0].text;
  } else if (data.error) {
    return "APIエラー: " + data.error.message;
  } else {
    return "APIレスポンスに返答がありません";
  }*/
}






const { Player } = TextAliveApp;

// TextAlive Player を初期化
const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: {
    token: "JY0mLoHiX3lPTJaS",
    parameters: [
      {
        title: "Gradation start color",
        name: "gradationStartColor",
        className: "Color",
        initialValue: "#bfaefc",
      },
      {
        title: "Gradation middle color",
        name: "gradationMiddleColor",
        className: "Color",
        initialValue: "#fea3db"
      },
      {
        title: "Gradation end color",
        name: "gradationEndColor",
        className: "Color",
        initialValue: "#9ae1dd",
      },
    ],
  },

  mediaElement: document.querySelector("#media"),
  mediaBannerPosition: "bottom right",

  // オプション一覧
  // https://developer.textalive.jp/packages/textalive-app-api/interfaces/playeroptions.html
});

const overlay = document.querySelector("#overlay");
const bar = document.querySelector("#bar");
const textContainer = document.querySelector("#text");
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
let lastTime = -1;

player.addListener({
  /* APIの準備ができたら呼ばれる */
  onAppReady(app) {
    if (app.managed) {
      document.querySelector("#control").className = "disabled";
    }
    if (!app.songUrl) {
      document.querySelector("#media").className = "disabled";

      // ストリートライト / 加賀(ネギシャワーP)
      /*player.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
        video: {
          // 音楽地図訂正履歴
          beatId: 4694275,
          chordId: 2830730,
          repetitiveSegmentId: 2946478,
          
          // 歌詞URL: https://piapro.jp/t/DPXV
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
          lyricId: 67810,
          lyricDiffId: 20654
        },
      });*/

      // パレードレコード / きさら

      // ハローフェルミ
      /* 曲の情報 */   
      player.createFromSongUrl("https://piapro.jp/t/oTaJ/20250204234235", {
        video: {
          beatId: 4694278,
          chordId: 2830733,
          repetitiveSegmentId: 2946481,
          lyricId: 67813,
          lyricDiffId: 20657
        }
      });
    }
    
    // AIに"こんにちは"を送り返答をポップアップで表示
  getAIReply()
    .then(reply => {
      // 返答がエラーや空の場合も考慮
      if (!reply) {
        alert("AIの返答が取得できませんでした。");
      } else {
        alert("AIの返答: " + reply);
      }
    })
    .catch(err => {
      // エラー内容も詳細に表示
      alert("API呼び出しエラー: " + (err && err.message ? err.message : err));
    });

  },

  /* パラメタが更新されたら呼ばれる */
  onAppParameterUpdate: () => {
    const params = player.app.options.parameters;
    const sc = player.app.parameters.gradationStartColor,
      scString = sc ? `rgb(${sc.r}, ${sc.g}, ${sc.b})` : params[0].initialValue;
    const mc = player.app.parameters.gradationMiddleColor,
      mcString = mc ? `rgb(${mc.r}, ${mc.g}, ${mc.b})` : params[0].initialValue;
    const ec = player.app.parameters.gradationEndColor,
      ecString = ec ? `rgb(${ec.r}, ${ec.g}, ${ec.b})` : params[1].initialValue;
    document.body.style.backgroundColor = ecString;
    document.body.style.backgroundImage = `linear-gradient(0deg, ${ecString} 0%, ${mcString} 50%, ${scString} 100%)`;
  },

  /* 楽曲が変わったら呼ばれる */
  onAppMediaChange() {
    // 画面表示をリセット
    overlay.className = "";
    bar.className = "";
    resetChars();
  },

  /* 楽曲情報が取れたら呼ばれる */
  onVideoReady(video) {
    // 楽曲情報を表示
    document.querySelector("#artist span").textContent =
      player.data.song.artist.name;
    document.querySelector("#song span").textContent = player.data.song.name;

    // 最後に取得した再生時刻の情報をリセット
    lastTime = -1;
  },

  /* 再生コントロールができるようになったら呼ばれる */
  onTimerReady() {
    overlay.className = "disabled";
    document.querySelector("#control > a#play").className = "";
    document.querySelector("#control > a#stop").className = "";
  },

  /* 再生位置の情報が更新されたら呼ばれる */
  onTimeUpdate(position) {
    // シークバーの表示を更新
    paintedSeekbar.style.width = `${
      parseInt((position * 1000) / player.video.duration) / 10
    }%`;

    // 新しいビートを検出
    const beats = player.findBeatChange(lastTime, position);
    if (
      lastTime >= 0 &&
      // ↑初期化された直後はビート検出しない
      beats.entered.length > 0
      // ↑二拍ごとにしたければ
      //   && beats.entered.find((b) => b.position % 2 === 1)
      // のような条件を足してチェックすればよい
    ) {
      // ビート同期のアニメーションを発火させる
      requestAnimationFrame(() => {
        bar.className = "active";
        requestAnimationFrame(() => {
          bar.className = "active beat";
        });
      });
    }

    // 歌詞情報がなければこれで処理を終わる
    if (!player.video.firstChar) {
      return;
    }

    // 巻き戻っていたら歌詞表示をリセットする
    if (lastTime > position + 1000) {
      resetChars();
    }

    // 500ms先に発声される文字を検出
    // 初回は開始時からの差分区間、それ以降は前回実行時からの差分区間を検出
    const chars = player.video.findCharChange(lastTime < 0 ? lastTime : lastTime + 500, position + 500);
    for (const c of chars.entered) {
      // 新しい文字が発声されようとしている
      newChar(c);
    }

    // 次回呼ばれるときのために再生時刻を保存しておく
    lastTime = position;
  },

  /* 楽曲の再生が始まったら呼ばれる */
  onPlay() {
    const a = document.querySelector("#control > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("\uf28b"));
  },

  /* 楽曲の再生が止まったら呼ばれる */
  onPause() {
    const a = document.querySelector("#control > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("\uf144"));
  },
});

/* 再生・一時停止ボタン */
document.querySelector("#control > a#play").addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    if (player.isPlaying) {
      player.requestPause();
    } else {
      player.requestPlay();
    }
  }
  return false;
});

/* 停止ボタン */
document.querySelector("#control > a#stop").addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    player.requestStop();

    // 再生を停止したら画面表示をリセットする
    bar.className = "";
    resetChars();
  }
  return false;
});

/* シークバー */
seekbar.addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    player.requestMediaSeek(
      (player.video.duration * e.offsetX) / seekbar.clientWidth
    );
  }
  return false;
});

/**
 * 新しい文字の発声時に呼ばれる
 * Called when a new character is being vocalized
 */
function newChar(current) {
  // 品詞 (part-of-speech)
  // https://developer.textalive.jp/packages/textalive-app-api/interfaces/iword.html#pos
  const classes = [];
  if (
    current.parent.pos === "N" ||
    current.parent.pos === "PN" ||
    current.parent.pos === "X"
  ) {
    classes.push("noun");
  }

  // フレーズの最後の文字か否か
  if (current.parent.parent.lastChar === current) {
    classes.push("lastChar");
  }

  // 英単語の最初か最後の文字か否か
  if (current.parent.language === "en") {
    if (current.parent.lastChar === current) {
      classes.push("lastCharInEnglishWord");
    } else if (current.parent.firstChar === current) {
      classes.push("firstCharInEnglishWord");
    }
  }

  // noun, lastChar クラスを必要に応じて追加
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(current.text));

  // 文字を画面上に追加
  const container = document.createElement("div");
  container.className = classes.join(" ");
  container.appendChild(div);
  container.addEventListener("click", () => {
    player.requestMediaSeek(current.startTime);
  });
  textContainer.appendChild(container);
}

/**
 * 歌詞表示をリセットする
 * Reset lyrics view
 */
function resetChars() {
  lastTime = -1;
  while (textContainer.firstChild)
    textContainer.removeChild(textContainer.firstChild);
}



/**
   * 波紋を画面に追加する関数
   * @param {number} x - クリックされた位置のX座標
   * @param {number} y - クリックされた位置のY座標
   */
  function createRipple(x, y) {
    // 波紋を4つ作成（少しずつ遅れて重なるように）
    for (let i = 0; i < 1; i++) {
      const ripple = document.createElement('div'); // div要素を新しく作成
      ripple.className = 'ripple'; // 波紋スタイルを適用

      // 2つ目以降の波紋に遅延クラスを追加（0.3s, 0.6s, 0.9s）
      if (i > 0) {
        ripple.classList.add(`delay-${i}`);
      }

      // 波紋の位置をクリックされた場所に設定
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      // ページに波紋を追加
      document.body.appendChild(ripple);

      // 3.5秒後に波紋を削除（画面に残らないように）
      setTimeout(() => ripple.remove(), 3500);
    }
  }

  // 画面クリック時に波紋を発生させる
  document.body.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY); // マウスの位置を渡す
  });

  // 背景画像のURLを配列として定義します
// ※画像は "images" フォルダに保存しておく必要があります
const backgroundImages = [
  "url('https://cdn.pixabay.com/photo/2021/10/30/17/54/desert-6755127_1280.jpg')",
];

// 現在表示している背景画像のインデックスを記録します
let currentImageIndex = 0;

// 背景画像を切り替える関数を定義します
function changeBackgroundImage() {
  // bodyの背景画像スタイルを、現在のインデックスにある画像に設定します
  document.body.style.backgroundImage = backgroundImages[currentImageIndex];

  // インデックスを1つ進めます（最後まで行ったら0に戻るようにします）
  currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
}

// TextAlive App のプレイヤーが利用可能になったときのイベント
player.addListener({
  onAppReady(app) {
    // ここに他の初期化コードが入っているかもしれません

    // 最初の背景画像を即時に設定しておきます（ページ読み込み直後）
    changeBackgroundImage();

    // setInterval関数で、10秒ごと（10000ミリ秒ごと）に
    // changeBackgroundImage 関数を実行するように設定します
    setInterval(changeBackgroundImage, 10000);
  }

  // 他のリスナー（必要に応じて追加）...
});


// 並び替えた画像を sessionStorage から取得
const sortedImagesJSON = sessionStorage.getItem("sortedImages");
let bgIndex = 0;

if (sortedImagesJSON) {
  const sortedImages = JSON.parse(sortedImagesJSON);
  const bgContainer = document.getElementById("bg-slideshow");

  // 画像要素を順番に追加（非表示状態）
  sortedImages.forEach((imgData, i) => {
    const img = document.createElement("img");
    img.src = imgData.base64;
    if (i === 0) img.classList.add("active"); // 最初の画像を表示
    bgContainer.appendChild(img);
  });

  const images = bgContainer.querySelectorAll("img");
  let bgIndex = 0;

  function changeImageSequentially() {
    // 現在の画像を非表示
    images[bgIndex % images.length].classList.remove("active");

    // インデックス更新
    bgIndex = (bgIndex + 1) % images.length;

    // 次の画像を表示
    images[bgIndex].classList.add("active");

    // 次の切り替えまでの時間（intervalが足りない場合はデフォルト1万ミリ秒）
    const nextDelay = interval[bgIndex % interval.length] || 10000;

    // 次の画像に切り替える
    setTimeout(changeImageSequentially, nextDelay);
  }

  // 最初の呼び出し（最初の画像は表示済みなので、初回遅延を使う）
  setTimeout(changeImageSequentially, interval[0] || 10000);
}