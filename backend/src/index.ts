import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// APIルート
app.use("/api/chat", chatRouter);

// ヘルスチェック用
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// サーバ起動
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});

