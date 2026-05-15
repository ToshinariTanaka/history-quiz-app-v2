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
