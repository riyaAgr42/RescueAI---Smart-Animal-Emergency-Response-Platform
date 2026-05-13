import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Toast from "../components/Toast.jsx";
import { getAIResponse } from "../utils/aiBot.js";
import api from "../services/api.js";

const AiChat = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm RescueAI Assistant. Ask me anything about reporting, volunteers, or priorities." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [image, setImage] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    let imageUrl = null;
    if (image) {
      const fd = new FormData();
      fd.append("image", image);
      const { data } = await api.post("/uploads/chat", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = data.url;
      setImage(null);
    }

    const textWithPhotoFlag = imageUrl ? `${input.trim()} [photo]` : input.trim();
    const userMsg = { from: "you", text: input.trim(), image: imageUrl };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const botReply = { from: "bot", text: getAIResponse(textWithPhotoFlag) };
      if (imageUrl) botReply.image = imageUrl;
      setMessages((prev) => [...prev, botReply]);
      setTyping(false);
    }, 350); // fast, instant-feel
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display">AI Chat</h2>
        </div>
        <div className="glass rounded-2xl p-4 h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  m.from === "you"
                    ? "ml-auto bg-primary text-white"
                    : "bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-700"
                }`}
              >
                <p className="text-sm">{m.text}</p>
                {m.image && (
                  <img
                    src={m.image}
                    alt="attachment"
                    className="mt-2 rounded-xl max-h-48 object-cover"
                  />
                )}
              </div>
            ))}
            {typing && (
              <div className="w-16 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs text-slate-500">
                typing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="mt-3 flex gap-2 flex-wrap">
            <input
              className="flex-1 rounded-xl border px-3 py-2"
              placeholder="Ask the assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <label className="text-sm px-3 py-2 border rounded-xl cursor-pointer">
              Attach photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <button className="btn-primary px-4 py-2">Send</button>
          </form>
          {image && (
            <p className="text-xs text-slate-500 mt-1">Attached: {image.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChat;
