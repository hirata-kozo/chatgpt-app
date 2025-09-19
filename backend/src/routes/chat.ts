import { Router } from "express";
import OpenAI from "openai";
import { searchSimilar } from "../vectorStore";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    console.log("=== /chat called ===");
    console.log("Raw req.body:", req.body);

    const { question, message } = req.body;
    const userQuestion = (question || message)?.toString().trim();

    if (!userQuestion) {
      console.warn("Bad Request: question/message is missing or not a string");
      return res.status(400).json({ error: "question is required" });
    }

    console.log("Question:", userQuestion);

    // 類似文書検索
    const docs = searchSimilar(userQuestion, 5);
    console.log("Found docs:", docs.length);
    docs.forEach((d, i) =>
      console.log(`Doc[${i}] key: ${d.key}, text length: ${d.text.length}`)
    );

    const context = docs.map(d => d.text).join("\n\n");

    console.log("Calling OpenAI Chat API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは S3 に保存された資料を参考に回答するアシスタントです。"
        },
        {
          role: "user",
          content: `資料:\n${context}\n\n質問: ${userQuestion}`
        }
      ],
      max_completion_tokens: 500 // ← 修正ポイント
    });
    console.log("OpenAI API called successfully");

    const answer = completion.choices[0].message?.content || "";
    console.log("Answer length:", answer.length);

    res.json({ answer });
  } catch (err) {
    console.error("Error in /chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

