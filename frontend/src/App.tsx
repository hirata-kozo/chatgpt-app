import React, { useState } from "react";

const App: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setAnswer("回答取得中...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!res.ok) throw new Error("APIエラー");

      const data = await res.json();
      setAnswer(data.reply);
    } catch (err) {
      setAnswer("エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">ChatGPT 問い合わせ</h1>
      <textarea
        className="w-full max-w-lg p-2 border rounded mb-2"
        rows={4}
        placeholder="質問を入力してください..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        送信
      </button>
      {answer && (
        <div className="mt-4 p-4 w-full max-w-lg bg-white border rounded shadow">
          <h2 className="font-semibold mb-2">回答</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default App;

