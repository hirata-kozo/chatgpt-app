# ChatGPT アプリ

## 概要

このリポジトリは、OpenAI の ChatGPT API を統合したシンプルな React ベースのウェブアプリケーションです。

### 主な機能
- **AWS S3から教師データの取得**: S3から教師データを取得する。
- **ChatGPTの回答**: 教師データ・質問に対してChatGPTの回答する。
- **レスポンシブデザイン**: CSS Flexbox とメディアクエリを使用して、デスクトップおよびモバイルデバイスに対応。
- **エラーハンドリング**: API レート制限やネットワークエラーを適切に処理。
- **環境設定**: 環境変数を使用して API キーを安全に管理。

## 使用技術
- **フロントエンド**: React（状態管理に Hooks を使用）
- **スタイリング**: CSS Modules または Tailwind CSS（セットアップに応じて）
- **API 統合**: OpenAI Node.js SDK または直接の fetch 呼び出し
- **ビルドツール**: Vite または Create React App
- **コンテナ化**: Docker および Docker Compose（コンテナ化された環境での実行をサポート）
- **デプロイ**: Vercel、Netlify、または GitHub Pages に簡単にデプロイ可能

## 始め方

### 前提条件
- Node.js（バージョン 20）
- Docker および Docker Compose（Docker での実行を希望する場合）
- OpenAI API キー（[openai.com](https://openai.com) でサインアップして生成）

### インストール
1. リポジトリをクローン:
   ```
   git clone https://github.com/hirata-kozo/chatgpt-app.git
   cd chatgpt-app
   ```
2. 依存関係をインストール:
   ```
   npm install
   ```
3. 環境変数を設定:
   - ルートディレクトリに `.env` ファイルを作成。
   - OpenAI API キーを追加:
     ```
     REACT_APP_OPENAI_API_KEY=your-api-key-here
     ```

### アプリの実行（ローカル）
1. 開発サーバーを起動:
   ```
   npm start
   ```
2. ブラウザを開き、`http://localhost:3000` にアクセス。
3. チャットを始める！入力フィールドにメッセージを入力し、Enter キーまたは「送信」をクリック。

### アプリの実行（Docker Compose）
1. Docker Compose を使用してアプリケーションを起動:
   ```
   docker-compose up -f docker-compose.prd.yml --build
   ```
2. ブラウザを開き、`http://localhost` にアクセス。
3. チャットを始める！入力フィールドにメッセージを入力し、Enter キーまたは「送信」をクリック。
4. 終了するには、コンテナを停止:
   ```
   docker-compose down
   ```
   - 注: `.env` ファイルに `REACT_APP_OPENAI_API_KEY` が設定されていることを確認してください。

## 使用方法
- **チャット**: 下部のテキストエリアにメッセージを入力。AI が自動的に応答。
- **チャットクリア**: クリアボタンを使用して会話をリセット。
- **カスタマイズ**: API 呼び出しの `prompt` を変更して AI のパーソナリティを調整（例: よりフォーマルまたは楽しい口調）。

例のやり取り:
- ユーザー: 「こんにちは、フランスの首都はどこですか？」
- AI: 「フランスの首都はパリです！」

## プロジェクト構造
```
chatgpt-app
├── README.md
├── backend
│   ├── Dockerfile
│   ├── node_modules
│   ├── package.json
│   ├── src
│   │   ├── index.ts
│   │   ├── routes
│   │   │   └── chat.ts
│   │   ├── s3Loader.ts
│   │   └── vectorStore.ts
│   └── tsconfig.json
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── frontend
    ├── Dockerfile
    ├── index.html
    ├── nginx
    │   └── nginx.conf
    ├── node_modules
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.tsx
    │   ├── components
    │   │   └── ChatForm.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## 貢献方法
貢献を歓迎します！リポジトリをフォークし、変更を加えてプルリクエストを送信してください。大きな変更の場合は、まず GitHub で Issue を開いて議論してください。

1. プロジェクトをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチをプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## ライセンス
このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 謝辞
- 素晴らしい ChatGPT API を提供する OpenAI。
- 優れたフレームワークを提供する React コミュニティ。
- Docker および Docker Compose コミュニティによるコンテナ化技術の提供。

ご質問や問題がある場合は、気軽に GitHub Issue を開いてください！ 🚀