# 開発手順

## ローカルで読み込む

1. `chrome://extensions` を開く
2. Developer mode を有効にする
3. Load unpacked を選ぶ
4. このリポジトリのディレクトリを選択する
5. チャット付きの YouTube ライブ配信を開く

## 変更の流れ

- JavaScript の挙動は `src/content.js` を編集する
- 表示スタイルは `src/content.css` を編集する
- 変更後は `chrome://extensions` で拡張機能を再読み込みする
- この拡張は現時点ではビルド工程を持たない

## 確認観点

- 通常チャットの投稿者名左に `HH:mm:ss` 形式の時刻が表示されること
- Super Chat とメンバーシップ通知でも時刻が表示されること
- YouTube 側の時刻データがない場合に、観測時刻の fallback が表示されること
- 追加された時刻表示がチャット本文や投稿者名と重ならないこと
