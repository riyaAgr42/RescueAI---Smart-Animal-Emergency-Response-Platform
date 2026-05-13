import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Spinner from "../components/Spinner.jsx";
import Toast from "../components/Toast.jsx";
import api from "../services/api.js";
import { getAIResponse } from "../utils/aiBot.js";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [toast, setToast] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await api.get("/messages");
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const userText = content.trim();
    await api.post("/messages", { content: userText, toRole: "admin" });
    // instant bot assist reply (local)
    const botReply = { _id: `bot-${Date.now()}`, from: { name: "RescueAI Bot", role: "assistant" }, content: getAIResponse(userText), createdAt: new Date().toISOString() };
    setContent("");
    setToast("Message sent");
    setTimeout(() => setToast(""), 2000);
    setMessages((prev) => [botReply, ...prev]);
    fetchMessages();
  };

  return (
    <div className="flex gap-6">
      {toast && <Toast message={toast} />}
      <Sidebar />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display">Chat with Admin/Volunteers</h2>
        </div>
        <div className="glass rounded-2xl p-4 h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <Spinner />
            ) : (
              messages.map((m) => (
                <div key={m._id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{m.from?.name || "User"} ({m.from?.role})</span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm mt-1">{m.content}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={send} className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl border px-3 py-2"
              placeholder="Ask a question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn-primary px-4 py-2">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
