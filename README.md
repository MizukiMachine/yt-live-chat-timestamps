# YouTube Live Chat Timestamps

## 拡張機能概要

- YouTube のライブチャットに `HH:mm:ss` 形式の時刻を追加表示する Chrome 拡張
- `youtube.com` 上のライブチャットフレームで動作し、通常チャット、Super Chat、メンバーシップ通知を対象にする
- ビルド工程を持たず、`manifest.json` と `src/` だけで構成される

## 拡張機能の仕様と挙動

- `document_idle` で content script を全フレームに読み込む
- 読み込み済みのチャットメッセージと、追加された新規メッセージの両方を装飾する
- YouTube の renderer data にある `timestampUsec` や `timestampText` を優先して時刻を取得する
- renderer data から取得できない場合は DOM の `#timestamp`、それもない場合はメッセージを観測したローカル時刻を使う
- 取得した時刻は投稿者名の左に `.ylct-timestamp` として挿入する
- 対象メッセージ内の YouTube 標準 `#timestamp` は非表示にし、拡張が追加した時刻表示に揃える

## 構成

- `manifest.json`: Manifest V3 の拡張定義、content script、対象 URL
- `src/content.js`: チャットメッセージの検出、時刻取得、表示要素の挿入
- `src/content.css`: 追加タイムスタンプの見た目と YouTube 標準時刻の非表示化

```text
YouTube live chat frame
  -> src/content.js
  -> renderer data / DOM #timestamp / observed local time
  -> .ylct-timestamp badge
  -> src/content.css
```

## 関連ドキュメント

- 開発手順: [docs/development.md](docs/development.md)
