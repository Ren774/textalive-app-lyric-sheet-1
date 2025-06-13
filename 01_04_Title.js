/**
 * 1つの波紋を3つの円で重ねて作る関数
 * @param {number} x - 波紋を表示するX座標（画面の横位置）
 * @param {number} y - 波紋を表示するY座標（画面の縦位置）
 */
function createRippleSet(x, y) {
  for (let i = 0; i < 3; i++) {
    // div要素を新しく作成（波紋の円）
    const ripple = document.createElement('div');

    // CSSの「ripple」クラスを適用して見た目を設定
    ripple.className = 'ripple';

    // 2つ目と3つ目の波紋に遅延クラスを追加し、時間差で広がるようにする
    if (i === 1) ripple.classList.add('delay-1');
    if (i === 2) ripple.classList.add('delay-2');

    // 波紋の位置を指定（クリックした位置など）
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // body要素に波紋を追加（画面に表示）
    document.body.appendChild(ripple);

    // 3.5秒後に波紋を削除して、ページが重くならないようにする
    setTimeout(() => ripple.remove(), 3500);
  }
}

// 背景動画の要素を取得
const video = document.getElementById('bgVideo');

// 動画が再生を始めたときの処理
video.addEventListener('play', () => {
  // 画面の幅と高さを取得
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 画面中央に波紋を作る
  createRippleSet(vw * 0.5, vh * 0.5);

  // 画面の右上付近に波紋を作る
  createRippleSet(vw * 0.75, vh * 0.3);

  // クリックレイヤーを取得
    const layer = document.getElementById("clickLayer");

    // クリック時の処理を設定
    layer.addEventListener("click", function () {
      // index.html にページ遷移
      window.location.href = "upload.html";
    });

}, { once: true }); // この処理は動画再生時に1回だけ実行
