# Node.js 20 ベースイメージ
FROM node:20

# 作業ディレクトリ
WORKDIR /app

# package.json と tsconfig.json を先にコピーして依存キャッシュ効率化
COPY package*.json tsconfig.json ./

# 依存関係インストール
RUN npm install

# ソースコードをコピー
COPY src ./src

# TypeScript をビルド
RUN npm run build

# 本番起動（CommonJS 用）
CMD ["node", "dist/index.js"]

