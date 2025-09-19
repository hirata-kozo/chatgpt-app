import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); // 追加

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);  // 処理開始
    setAnswer("");     // 前回の回答をクリア

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error("Error:", err);
      setAnswer("エラーが発生しました");
    } finally {
      setLoading(false); // 処理終了
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">ChatGPT セキュリティ質問</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="質問を入力してください"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading} // 処理中はボタン無効化
        >
          送信
        </button>
      </form>

      <div className="mt-4 p-4 w-full max-w-lg bg-white border rounded shadow">
        <h2 className="font-semibold mb-2">回答</h2>
        {loading ? (
          <p>回答中…</p>
        ) : (
          <pre className="whitespace-pre-wrap">{answer}</pre>
        )}
      </div>
    </div>
  );
}

export default App;

