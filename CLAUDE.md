# SORA（民宿サイト）プロジェクトメモ

新しいClaudeセッションでこのフォルダを開いたら、まずこのファイルを読んでください。

## サイト概要

大阪の民宿「SORA」のホームページ。全6ページ構成。

- `index.html` — TOP
- `concept.html` — CONCEPT（宿について）
- `room.html` — ROOM（お部屋紹介）
- `amenities.html` — AMENITIES（設備・アメニティ）
- `access.html` — ACCESS（アクセス）
- `contact.html` — CONTACT（お問い合わせ）

デスクトップは上記6ページを別々に表示。スマホ幅（800px以下）では、
`index.html` が他5ページの中身を `fetch` で取得してスクロール1本の
ページに連結する仕組みになっている（`index.html` 内の
`#mobile-sections` 周りのスクリプトを参照）。

## 公開場所

- **GitHubリポジトリ**: https://github.com/oonishionearrow-del/sora-stay2
  - アカウント: `oonishionearrow-del`（`gh auth status` で確認可能）
- **公開URL（Cloudflare Pages）**: https://sora-stay2.pages.dev/
  - Cloudflareプロジェクト名: `sora-stay2`
  - Cloudflareアカウント: `oonishi.onearrow@gmail.com`

## 編集〜公開の流れ

1. このフォルダ内のHTMLを編集
2. GitHubに反映:
   ```bash
   git add -A
   git commit -m "変更内容"
   git push
   ```
3. Cloudflare Pagesにデプロイ:
   ```bash
   npx wrangler pages deploy . --project-name=sora-stay2 --branch=main --commit-dirty=true
   ```

※ `wrangler` は初回に `npx wrangler login` でこのPC上で認証済み。
別PCで作業する場合は再ログインが必要。

## 経緯・注意点

- トップの背景（PC=写真フェードイン／スマホ=動画）は、CSSの
  `background-image` を `position:fixed` の疑似要素で実装したところ、
  実機のAndroidで真っ黒になる不具合が発生した。原因は完全には
  特定できていないが、「画面いっぱいに固定表示する」構造をやめて
  `concept.html` 等と同じ「普通に配置するセクション」方式
  （`.hero-section`、position:fixedを使わない）に作り替えたら解消した。
  → 今後トップの背景を触るときは、position:fixedやbody疑似要素を
  使う実装に戻さないよう注意。
- スマホ版のみ、トップのロゴ＋メニューを一本の固定ヘッダーバー
  （`.site-header`）にまとめている。PC版は `display:contents` で
  無効化し、元の個別配置のまま。
- room.htmlのスライダーはスワイプ対応済み。
