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
`index.html` が他のページの中身を `fetch` で取得してスクロール1本の
ページに連結する仕組みになっている（`index.html` 内の
`#mobile-sections` 周りのスクリプトを参照）。連結するのは
CONCEPT・ROOM・AMENITIES・ACCESS・CONTACT。連結ページの追加・削除をしたら、
`pages` の一覧と `scopeMap`（`mobile-embed-番号`）の番号を合わせること。
ROOM はスマホで縦に長くならないよう、動画を小さくし、写真ギャラリーを
横1段のスワイプ表示にしている（`assets/site-extras.css` のスマホ用の指定）。

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
- room.htmlの上部にあった矢印で切り替えるスライダー（写真4枚＋動画）は削除した。代わりに ROOM TOUR（動画）と GALLERY（写真）を置いている。使わなくなった画像・動画は `images/_unused/room-slider-*`。

## 画像フォルダの構成

`images/` はページ別に分けてある。新しい画像は該当ページのフォルダに入れ、HTML側は `images/<フォルダ>/<ファイル名>` で参照する。

- `common/` — 全ページ共通（ロゴ）
- `top/` — index.html（背景写真・スマホ背景動画）
- `concept/` `room/` `amenities/` `access/` `contact/` — 各ページ用
- `_unused/` — どのHTMLからも参照されていない画像（削除はしていない。不要なら消してよい）

## ギャラリー写真・動画（ROOMページ）

- 元画像: `images/gallery/<カテゴリ>/<カテゴリ>-NN.jpg`（拡大表示で使う大きい写真）
- 一覧用の縮小版: `images/gallery/thumb/<カテゴリ>-NN.jpg`（幅640px。元画像を追加したら同名で縮小版も作る）
- 動画: `images/video/room-tour.mp4`（縦型720×1280・56秒・約14MB）、再生前の写真 `images/video/room-tour-poster.jpg`
- 追加の動き（拡大表示・カテゴリ絞り込み）は共通ファイル `assets/site-extras.css` / `assets/site-extras.js`。**スマホ版トップは他ページを合体表示し、各ページの最初の `<script>` と最初の `<style>` しか取り込まないため**、新しい動きはこの共通ファイルに書き、`index.html` でも読み込んでいる。クラス名は `sx-` で始める。
- 写真を足す手順: 大きい写真と縮小版を置く → `room.html` の `.sx-grid` に `<a class="sx-item" ...>` を1つ足す（縦長は `sx-item is-tall`、`loading="lazy"` と `alt` を必ず付ける）。

**ROOMページの構成:** 古い見出し・説明文の箱とスライダーは削除済み。今は ROOM TOUR（動画）と GALLERY（写真）だけ。ギャラリーには、他のページと同じ写真は載せない（照合で重複と分かった5枚 = 客室04・食事01・食事04・小物04・小物10 は `images/_unused/gallery-duplicates/` に移してある）。景色02（元 44565）は CONCEPT の一番上の写真に使ったため、ギャラリーから外して `images/concept/hero.jpg` に移した。**「食事」カテゴリは廃止**：写っているのは実際の食事ではなくお部屋の雰囲気づくりの写真で、食事が出ると誤解されるため、残っていた2枚（元 44586・44593）を `images/_unused/gallery-removed-food/` に移し、絞り込みボタンも外した。食事の写真は、実際に食事を出す場合を除いて、ギャラリーに入れないこと。

元の番号との対応（重複で外した分は除く）（`images/new` に入れた元ファイル名 `44xxx.jpg`）:

- 客室 (`room`): 01=44560, 02=44561, 03=44575, 05=44577, 06=44578, 07=44579, 08=44581, 09=44582, 10=44589, 11=44598, 12=44599, 13=44600, 14=44604
- キッチン・食器 (`kitchen`): 01=44568, 02=44569, 03=44570, 04=44571, 05=44572
- お風呂・洗面 (`bath`): 02=44567, 03=44587, 04=44590, 05=44591
- 小物 (`detail`): 01=44583, 02=44584, 03=44585, 06=44595, 07=44596, 08=44597, 09=44601, 11=44606
- 動画 `room-tour.mp4` = 44563.mp4 / 観光チラシ（ACCESS で使用）= 44573.jpg

## CONCEPT の一番上の写真

- 使っている写真: `images/concept/hero.jpg`（ベランダから街を眺める後ろ姿。元は新規写真 44565）。以前の SORA ロゴ看板の写真は `images/_unused/concept1-old-hero-sora-sign.jpg`。
- 文字「STAY LIKE A RESORT」が人物にかからないよう、PC・スマホとも写真を少し拡大して左寄せにしている（`concept.html` の `.hero` の `background-size` / `background-position`）。写真を差し替えるときは、この2つの値も見直すこと。
- PCの枠の高さは `min(max(65vh, 41vw), 88vh)`。横に長い画面（例 1920×950）で枠が細長くなると人物の頭が切れるため、横幅に応じて高さを確保している（1366×650 / 1920×950 / 2560×1100 で確認済み）。

## AMENITIES ページ（設備・アメニティ）

- 4つの項目（お部屋・キッチン・バスルーム・アメニティ）は、**写真（元の比率 3:2）＋項目のタグ**。項目の文字は元のまま（42個）。写真を細長く切り取ると不自然になるので、帯のような細長い形にはしない。PCは写真とタグを左右に並べて1つおきに入れ替える（`.sx-acc.is-rev`）。
- PCは全部ひらいたまま。**スマホは写真をタップして開閉**（最初の「お部屋」だけ開いた状態）。タップできると分かるよう、白い「一覧を見る＋」ボタンと、見出しの下の案内文を出している。開閉の動きは `assets/site-extras.js`、見た目は `assets/site-extras.css`（`.sx-acc` など）。
- 写真は `images/amenities/`：`cat-room.jpg`（元 room-15）、`cat-kitchen.jpg`（元 kitchen-06）、`cat-bath.jpg`（元 bath-06）、`cat-amenity.jpg`（元 bath-01）、`banner.jpg`（元 detail-05、最後の「ENJOY YOUR STAY」の背景）。ギャラリーとは同じ写真を重ねない。
- 最後の「ENJOY YOUR STAY」は、写真の角丸カードにした。ミント色につなぐ波型（`.wave-divider`）は使わなくなったので非表示。
- **注意**: AMENITIES のように `* { margin: 0; padding: 0 }` を持つページは、スマホのトップで連結されるとその指定が優先され、共通CSSの余白が効かなくなる。そのため `assets/site-extras.css` の余白には `!important` を付けている。

## 左上のロゴ

- 6ページすべてに、左上のロゴ（`images/common/logo.png`、`<img class="logo">`）を入れる。`concept.html` と `contact.html` はもともと入っておらず（履歴にもない）、後から足した。新しいページを作るときも入れること。
- 大きさ・位置はページごとに少しずつ違う（トップ・ROOM は別の値）。CONCEPT / AMENITIES / ACCESS / CONTACT は、PC 幅200px・左上（30px, 20px）、スマホ幅140px。
- スマホのトップは、連結するページの `img.logo` を取り除く（`index.html` の連結処理）ので、ロゴが二重にならない。

## CONCEPT「暮らすように泊まる」の夕焼けの写真

- 写真: `images/concept/sunset.jpg`（ベランダの夕焼け。縦長 1086×1448。元は新規写真 44564 で、ROOM のギャラリーの「景色」の1枚だった。CONCEPT に使ったためギャラリーから外し、「景色」のボタンも廃止）。
- 文章に「夕陽に染まる街並み」とあるので、その場所に置いている。**PC は縦長のまま左に、文章を右に並べる。スマホは文章の背景にして白い文字を重ねる**（写真を縦に足さないので長さが増えない）。縦長の写真を横長の帯に切ると不自然になるので、帯にはしない。
- 構造は `concept.html` の `.concept-inner` > `.concept-photo`（img）＋ `.concept-body`。スマホの暗さは `.concept::after` のグラデーション。

## ACCESS の観光ガイド（チラシ）

- 画像: `images/access/guide.jpg`（1024×1536）と、一覧用の縮小版 `guide-thumb.jpg`（480×720）。「Discover Osaka from SORA」のチラシで、文字が細かい。
- 場所: 「大阪観光の拠点に。」の文章の下、「交通アクセス」の上（`access.html` の `.guide`）。**PCはチラシを左・説明を右、スマホは小さなカード**（縦に長くしない）。画像を押すと拡大（`assets/site-extras.js` の `a.sx-zoom`）。1枚だけの拡大では矢印・枚数を出さず、細かい文字を読めるよう「元の画像を開く」リンクを出す。
- **JSの注意**: `site-extras.js` のクリック処理の中で、`open` / `step` など、関数と同じ名前の変数（`var open = ...`）を作らないこと。同じ名前の関数が上書きされ、写真の拡大が動かなくなる（AMENITIES の開閉を足したときに実際に起きた）。

## CONCEPT の並び順

上から: 一番上の写真 → ABOUT OUR ROOM → 暮らすように泊まる（夕焼けの写真）→ PERFECT FOR（FAMILY / GIRLS TRIP / LONG STAY）→ **4枚の写真（g1〜g4）** → 波型 → 人気観光スポットへのアクセス。夕焼けの写真のすぐ下に4枚の写真が続くと写真ばかりになるため、4枚の写真は PERFECT FOR の下に移した。

## ROOM TOUR の動画の BGM

- 動画 `images/video/room-tour.mp4` には BGM が**埋め込まれている**（音のトラックあり。映像は元のまま、56.4秒、約14.5MB）。元の音なしの動画は `images/_unused/room-tour-silent.mp4`。
- 曲: **Let's drive towards that sea**（作曲 Noru）。OpenTracks（旧DOVA-SYNDROME）の無料曲。ページ: https://opentracks.com/en/bgm/detail/20518 （ダウンロードは同ページの「Go to the free (mp3) download page」。フォーム送信で mp3 が取得できる）。
- 使用条件（確認済みの要点）: 背景音楽としての商用利用は可（サイト共通の音源利用ライセンス https://opentracks.com/help/articles/license/ ）。クレジット表記は不要（作曲者は「表記すると嬉しい」程度で、強制ではないと明記）。禁止: 音楽が主役のコンテンツ、音楽ファイルを単独で入手できる状態にすること、AI学習への利用。作曲者ごとの条件は作曲者ページにある。**サイトに mp3 を単独で置かないこと**（公開フォルダに `*.mp3` を入れない。BGMは動画に埋め込んだ形でのみ公開する）。
- 作り方（ffmpeg。映像はコピーなので画質は変わらない）: `ffmpeg -i 元の動画 -i bgm.mp3 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 128k -af "afade=t=in:st=0:d=1,afade=t=out:st=53.43:d=3" -t 56.4333 -movflags +faststart 出力.mp4`（最初の1秒フェードイン、最後の3秒フェードアウト）。ffmpeg はサイトのフォルダの外（作業用の一時フォルダ）に npm の ffmpeg-static で入れた。必要ならもう一度入れる。
- ブラウザの決まりで、音は**再生ボタンを押したときだけ**鳴る（自動再生では鳴らない）。動画は `preload="none"` のまま。

## PC：TOP以外のページの「帯」（ロゴを置く上の帯）

- PC（幅801px以上）の CONCEPT / ROOM / AMENITIES / ACCESS / CONTACT は、一番上に濃い色の帯（高さ80px）を置き、ロゴをその中に入れている。ロゴが写真と重なって見えなくなるのを避けるため。**TOP とスマホには帯を出さない。**
- 仕組み: 各ページの `<body class="sx-has-bar">` の直後に `<div class="sx-bar">`。見た目は `assets/site-extras.css` の「PC：TOP以外のページの、ロゴを置く上の帯」。ロゴ画像（`images/common/logo.png`）は、まわりに透明な余白が多いので、高さ100px・上に-10pxで余白を帯の外にはみ出させ、文字の部分が帯いっぱいに見えるようにしている。右上のメニューボタンも、帯の真ん中にそろえている。
- 各ページが `assets/site-extras.css` を読み込んでいる必要がある（CONCEPT と CONTACT には、このときに読み込みを足した）。新しいページを作るときも、`sx-has-bar` と `sx-bar` と CSS の読み込みを入れること。
- スマホのトップの連結表示では、`.sx-bar` と `img.logo` を取り除く（`index.html` の連結処理）ので、二重にならない。

## お問い合わせフォームの方針（保留中）

- 現状: **メールアプリを開く方式（`mailto:`）のまま**。送信先は `a.yoneda@yamafuku.jp`。ユーザーの判断で、当面このままにする（外部サービスは使わない）。
- 検討した代替案（採用していない）: Web3Forms（無料・月250件・登録不要だが、送信内容が最長3年外部に保存される可能性あり）、Googleフォーム（有名で安心。リンクで案内する形がおすすめ。デザインはサイトと別物）、formrun（日本の会社・無料は月30件・自動返信不可）、Formspree（無料は月50件）、Airbnbのメッセージに一本化。
- 外部サービスを使う場合は、問い合わせ専用のメールアドレスを使い、「内容は外部のフォームサービスを通じて送信されます」とフォームに書くこと。
