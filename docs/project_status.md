# project_status

- 最終更新: 2026-05-16
- 状態: スマホ表示の問題画像を「アスペクト比付き表示枠 + contain」に更新済み

## 現在の要点
- `style.css` の `.question-image-container` / `.question-image` 周辺のみを変更し、画像表示方式を整理。
- 通常幅では画像を `width: 100%` / `height: auto` / `object-fit: contain` で表示し、横はみ出しを防止。
- スマホ幅（`max-width: 600px`）ではコンテナに `aspect-ratio: 16 / 9` と `overflow: hidden` を適用し、表示枠を横長化。
- スマホ幅の画像は `width: 100%` / `height: 100%` / `object-fit: contain` で、画像内容を歪ませず枠内に全体表示。
- 画像なし問題の表示ロジックには変更を入れていないため、従来挙動を維持。

## 2026-05-16 追記（question-editor 復旧）
- `question-editor.js` / `question-editor.css` を追加し、`question-editor.html` の依存欠落を解消。
- テーブルヘッダー順は `id / era / question / image / imageAlt / answer / wrong1 / wrong2 / wrong3 / explanation / 操作` を維持。
- 読込/出力（JSON/Excel/CSV）、`wrongChoices` 変換、空id採番、JSON候補管理を実装。
