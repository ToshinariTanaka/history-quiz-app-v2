# project_status

- 最終更新: 2026-05-16
- 状態: スマホ表示の問題画像高さ抑制を反映済み

## 現在の要点
- `style.css` の `.question-image` は通常時 `width: auto` / `max-width: 100%` / `max-height: min(40vh, 320px)` で、縦横比を維持しつつ横はみ出しを防止。
- スマホ幅（`max-width: 600px`）では `.question-image` の `max-height: 220px` を適用し、問題文→画像→選択肢の視認性を優先。
- `quiz.html` の CSS 読み込みは `style.css?v=20260516-image-height-2` に更新し、キャッシュ影響を軽減。
- 画像未設定問題は従来どおり画像エリア非表示で、非画像問題への影響を抑えている。
