import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import pdfParse from "pdf-parse";
import xlsx from "node-xlsx";
import { Readable } from "stream";
import path from "path";

// S3クライアント
const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function listFiles(bucket: string) {
  const data = await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
  return data.Contents?.map(obj => obj.Key) || [];
}

export async function getFileContent(bucket: string, key: string) {
  const data = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const stream = data.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

// ファイルタイプごとのテキスト抽出
export async function extractText(buffer: Buffer, key: string): Promise<string> {
  const ext = path.extname(key).toLowerCase();
  if (ext === ".txt") {
    return buffer.toString("utf-8");
  } else if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === ".xlsx" || ext === ".xls") {
    const workSheets = xlsx.parse(buffer);
    return workSheets.map(ws => ws.data.map(row => row.join(",")).join("\n")).join("\n");
  } else if (ext === ".pptx") {
    const { parse } = require("pptx-parser");
    const pptData = await parse(buffer);
    return pptData.slides.map((s: any) => s.text).join("\n");
  } else {
    return "";
  }
}

