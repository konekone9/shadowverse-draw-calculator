# ドロー確率計算機

Shadowverse: Worlds Beyond の現在の山札・デッキから、目的カードへ到達する確率を計算する公開フロントエンドです。

## 開発

```bash
npm install
npm run dev
npm test
npm run build
```

## 公開

Cloudflare Pages のビルド設定は、ビルドコマンド `npm run build`、出力ディレクトリ `dist` です。

フッターの X リンクは、Cloudflare Pages の環境変数 `VITE_X_URL` で設定します。未設定時にはフッターへリンクを表示しません。

このリポジトリには、収集API、D1、認証情報、管理画面、本番収集スクリプトを含めません。
