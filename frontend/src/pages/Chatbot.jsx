import { useState, useRef, useEffect } from "react";
import API from "../api/axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post(
        "/chat",
        { history: messages, message: input },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages([
        ...updatedMessages,
        { role: "model", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "model",
          text: "Sorry, I had trouble responding. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-4">
        Gym Assistant
      </h1>

      <div className="flex-1 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-4 overflow-y-auto max-h-[60vh] space-y-3">
        {messages.length === 0 && (
          <p className="text-text-muted text-sm">
            Ask me anything about workouts, nutrition, or the gym!
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-accent-violet to-accent-pink text-white"
                  : "bg-surface-light text-text"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-light text-text-muted px-4 py-2 rounded-2xl text-sm italic">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
