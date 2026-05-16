# history-quiz-app-v2

歴史クイズアプリ（静的HTML/CSS/JS）です。

## 画像付き問題の仕様（要点）
- 問題データの `image` はファイル名のみを指定します（例: `ryotou-demo-map.svg`）。
- 実際の参照パスは `script.js` で `assets/question-images/${imageFileName}` を組み立てます。
- `image` がある問題だけ、問題文の下・選択肢の上に画像を表示します。
- `imageAlt` がある場合は `alt` に使用し、ない場合は `問題画像` を使用します。
