import { useState } from "react";

function ChatForm() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="質問を入力してください"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          送信
        </button>
      </form>
      {reply && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>ChatGPTの回答:</strong>
          <p className="mt-2">{reply}</p>
        </div>
      )}
    </div>
  );
}

export default ChatForm;

