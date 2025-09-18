import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// OpenAI API 設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数から取得
});

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // OpenAI Chat API 呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 固定モデル
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0]?.message?.content || "";

    res.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenAI API" });
  }
});

export default router;

