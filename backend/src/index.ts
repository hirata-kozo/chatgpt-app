import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRouter from "./routes/chat";
import { saveDocument } from "./vectorStore";

// S3 SDK
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as path from "path";
import { extractText } from "./s3Loader"; // s3Loader の extractText を使用

const app = express();
app.use(cors());
app.use(bodyParser.json());

// APIルート
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 3001;

// S3 クライアント
const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-northeast-1" });
const BUCKET = "shanon-security-check";
const PREFIX = "data_docs/";

// サーバー起動時に S3 を読み込んで vectorStore に保存
async function loadS3DocumentsToVectorStore() {
  console.log("Loading S3 documents into vector store...");

  try {
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX });
    const listResult = await s3.send(listCommand);
    const contents = listResult.Contents || [];

    for (const obj of contents) {
      if (!obj.Key) continue;

      const ext = path.extname(obj.Key).toLowerCase();
      if (![".txt", ".pdf", ".xlsx", ".xls", ".pptx"].includes(ext)) continue;

      console.log("Fetching S3 object:", obj.Key);
      const getCommand = new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key });
      const s3Object = await s3.send(getCommand);

      const stream = s3Object.Body as Readable;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(Buffer.from(chunk));
      const buffer = Buffer.concat(chunks);

      const text = await extractText(buffer, obj.Key);
      await saveDocument(obj.Key, text);
      console.log("Saved document to vectorStore:", obj.Key);
    }

    console.log("Finished loading S3 documents.");
  } catch (err) {
    console.error("Error loading S3 documents:", err);
  }
}

app.listen(PORT, async () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
  await loadS3DocumentsToVectorStore();
});

