## 今回やったこと
- 問題画像の読み込み方式を「データはファイル名のみ、実体は assets/question-images/ 配下」に変更。
- image未設定時・読込失敗時に画像エリアを非表示化。
- quiz.html に question-image-container / question-image を追加。
- style.css に question-image-container / question-image のスタイルを追加。

## 変更ファイル
- quiz.html
- script.js
- style.css
- docs/codex_report.md
- docs/architecture.md
- docs/next_tasks.md

## テスト結果
- node --check script.js: OK
- node -e "JSON.parse(fs.readFileSync('quiz-data_rekishi3.json','utf8'))": OK
- quiz.htmlにquestion-image-containerが存在することを確認: OK
- script.jsがassets/question-images/を参照することを確認: OK
- style.cssにquestion-image-container/question-imageがあることを確認: OK
- quiz-data_rekishi3.json id:1 にimage/imageAltがないことを確認: OK

## 注意点
- 本番問題データには画像サンプルを追加していない。
- id:1 には image / imageAlt を追加していない。

## 次にやるべきこと
- 実画像ファイルを assets/question-images/ に配置し、対応する問題にファイル名を追記。
- 画像命名規則と容量制限を運用ドキュメント化。

## チャッピーに相談すべき点
- 画像の推奨解像度・容量上限・アスペクト比をどう統一するか。


---

## 今回やったこと
- `quiz-data_rekishi3.json` の `id:33` に `image` / `imageAlt` が残っていないことを確認。
- `id:1` にも `image` / `imageAlt` がないことを確認。
- `script.js` が `assets/question-images/` を参照する実装のままであることを確認。
- JSON 構文チェックと `script.js` の構文チェックを実施。

## 変更ファイル
- docs/codex_report.md

## テスト結果
- `node --check script.js`: OK
- `node -e "const fs=require("fs"); JSON.parse(fs.readFileSync("quiz-data_rekishi3.json","utf8")); console.log("ok")"`: OK
- `node -e "const fs=require("fs"); const data=JSON.parse(fs.readFileSync("quiz-data_rekishi3.json","utf8")); const q33=data.find(q=>q.id===33); console.log("q33_has_image",Object.hasOwn(q33,"image"),Object.hasOwn(q33,"imageAlt")); const q1=data.find(q=>q.id===1); console.log("q1_has_image",Object.hasOwn(q1,"image"),Object.hasOwn(q1,"imageAlt"));"`: OK
- `rg -n "assets/question-images/" script.js`: OK

## 注意点
- 今回の依頼範囲では本番問題データへ画像付き問題を追加していない。
- `assets/question-images/ryotou-demo-map.svg` はそのまま保持される前提（ファイル削除なし）。

## 次にやるべきこと
- 遼東半島の画像付き問題を本番に入れる場合は、問題文・選択肢・解説が画像内容と一致する新規問題を別 ID で追加する。

## チャッピーに相談すべき点
- 画像確認用問題を本番データと分離する運用（検証用JSONを分けるかどうか）。
