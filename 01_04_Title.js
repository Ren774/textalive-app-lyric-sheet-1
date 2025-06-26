const rippleContainer = document.getElementById('ripple-container');

// ページが読み込まれたときに実行される処理
window.onload = () => {
  // 2秒後に波紋エフェクトを中央で作成する
  setTimeout(() => {
    // 画面の中央のx,y座標を渡して波紋を作る
    createRipple(window.innerWidth / 2, window.innerHeight / 2);

    // さらに4秒後（合計6秒後）に文字を表示し、クリックイベントを登録する
    setTimeout(() => {
      // idが'center-text-container'の要素を取得
      const centerText = document.getElementById('center-text-container');
      // 'show'というクラスを追加して文字を表示させる（CSSで見た目を変える想定）
      centerText.classList.add('show');

      // 文字表示後にクリックしたときの処理を登録
      document.addEventListener("click", (event) => {
        // idが'separator'の区切り線の要素を取得
        const separator = document.getElementById("separator");
        // クリックした場所の縦方向の座標（ピクセル単位）
        const clickY = event.clientY;
        // 区切り線の位置と高さの情報を取得
        const separatorRect = separator.getBoundingClientRect();
        // 区切り線の縦方向の中央位置を計算
        const separatorY = separatorRect.top + separatorRect.height / 2;

        // クリック位置が区切り線の上側なら
        if (clickY < separatorY) {
          console.log("STARTエリアがクリックされました");
          window.location.href = "upload.html";
        } else {
          // クリック位置が区切り線の下側なら
          console.log("Menuエリアがクリックされました");
          alert('Menu');  // Menuエリアがクリックされたことを知らせる
        }
      });

    }, 4000);  // 文字表示・クリックイベント登録まで4秒待つ

  }, 2000);  // 最初の波紋エフェクト作成まで2秒待つ
};

// 波紋エフェクトを指定した座標(x,y)に4つ作成する関数
function createRipple(x, y) {
  // 4つの波紋をループで作成
  for (let i = 0; i < 4; i++) {
    // div要素を新しく作る
    const ripple = document.createElement('div');
    // rippleというクラスをつける（CSSで波紋の見た目を作る想定）
    ripple.className = 'ripple';
    // 2つ目以降の波紋に遅延クラスを追加して波紋が順番に広がるようにする
    if (i > 0) ripple.classList.add(`delay-${i}`);
    // 波紋の位置を指定（画面の中央など）
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    // rippleContainer（波紋を入れる箱）に波紋を追加
    rippleContainer.appendChild(ripple);
    // 5秒後にこの波紋を消す（画面から削除）
    setTimeout(() => ripple.remove(), 5000);
  }
}

