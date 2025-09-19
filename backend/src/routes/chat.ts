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

    console.log("context", context);
    console.log("Calling OpenAI Chat API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは、株式会社シャノンの情報セキュリティ担当者です。"
        },
        {
          role: "user",
          content: `
          あなたは、企業のSHANON MARKETING PLATFORMのセキュリティ担当者です。
          下記資料を参考にして、質問にに200字以内でまとめて回答してください。
          ただし、50文字以内で簡潔に回答できるものは、50文字以内で回答してください。
          回答の文章は、簡潔で丁寧な表現にしてください。体言止めではなく、です、ます調で記述してください。
          回答の文章は、Excelに記入するにふさわしい形式で回答してください。
          質問や要求を復唱する必要はありません。回答のみ出力してください。
          選択肢の質問は、指定がない限り、最も適切な選択肢のみ回答してください。

	  資料:
		  ${context}

	  質問: ${userQuestion}
	  `
        }
      ],
      max_completion_tokens: 5000 // ← 修正ポイント
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

