# project_status

- 最終更新: 2026-05-16
- 状態: 画像付き問題表示の安定化対応を実施済み

## 現在の要点
- `quiz-data_rekishi3.json` の `image` がある問題のみ、`script.js` で `assets/question-images/${imageFileName}` を組み立てて表示する構成。
- `id:304` は `image: "ryotou-demo-map.svg"` を保持しており、表示確認対象として利用可能。
- 画像未設定問題は従来通り画像エリアを非表示にする。
