# history-quiz-app-v2

歴史クイズアプリ（静的HTML/CSS/JS）です。

## 画像付き問題の仕様（要点）
- 問題データの `image` はファイル名のみを指定します（例: `ryotou-demo-map.svg`）。
- 実際の参照パスは `script.js` で `assets/question-images/${imageFileName}` を組み立てます。
- `image` がある問題だけ、問題文の下・選択肢の上に画像を表示します。
- `imageAlt` がある場合は `alt` に使用し、ない場合は `問題画像` を使用します。

## question-editor について
- `question-editor.html` は `question-editor.js` と `question-editor.css` を読み込んで動作します。
- 問題編集テーブルの列順は次の通りです。
  - `id / era / question / image / imageAlt / answer / wrong1 / wrong2 / wrong3 / explanation / 操作`
- インポート対応: JSON / Excel / CSV
- エクスポート対応: JSON / Excel / CSV
- `wrongChoices`（配列）を読み込み時に `wrong1-3` へ展開し、JSON出力時は `wrongChoices` に再変換します。
