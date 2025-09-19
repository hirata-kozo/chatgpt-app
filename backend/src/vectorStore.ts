import Database = require("better-sqlite3");
import OpenAI from "openai";

// SQLite データベース初期化
const db = new Database("vectors.db");

// OpenAI クライアント初期化
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// テーブル作成
db.exec(`
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY,
  key TEXT,
  text TEXT,
  embedding BLOB
)
`);

/**
 * OpenAI Embedding を作成
 * @param text
 * @returns Buffer（Float32ArrayをBufferに変換）
 */
export async function createEmbedding(text: string): Promise<Buffer> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  // Float32Array → Buffer
  const floatArray = new Float32Array(response.data[0].embedding as unknown as number[]);
  return Buffer.from(floatArray.buffer);
}

/**
 * テキストをチャンクに分割
 * @param text
 * @param chunkSize 文字数単位
 * @returns string[]
 */
function splitTextIntoChunks(text: string, chunkSize = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * ドキュメントを保存（チャンク分割対応）
 * @param key S3キーなど
 * @param text 本文
 * @param chunkSize 文字数チャンク
 */
export async function saveDocument(
  key: string,
  text: string,
  chunkSize = 1000
): Promise<void> {
  const chunks = splitTextIntoChunks(text, chunkSize);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await createEmbedding(chunk);
    const stmt = db.prepare(
      "INSERT INTO documents (key, text, embedding) VALUES (?, ?, ?)"
    );
    stmt.run(`${key}_chunk${i + 1}`, chunk, embedding);
  }
}

/**
 * 類似文書検索（簡易版）
 * @param text 質問など
 * @param topK 上位何件取得するか
 * @returns ドキュメント配列
 */
export function searchSimilar(text: string, topK = 3) {
  // SQLiteだけでは正確なコサイン類似度計算は非効率
  // 実務では Pinecone や Weaviate など専用ベクトルDB推奨
  const stmt = db.prepare("SELECT * FROM documents LIMIT 100");
  return stmt.all();
}

