import { useState, useEffect, useRef } from "react";

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from Vercel Serverless Function
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        // Map _id from MongoDB to id
        const formatted = data.map(msg => ({
          id: msg._id,
          name: msg.name,
          text: msg.text,
          time: msg.time
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMessages();

    // Poll every 3 seconds to simulate real-time
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newMsg = {
      name: name.trim(),
      text: message.trim()
    };
    
    // Optimistic UI update
    const optimisticId = Date.now().toString();
    setMessages(prev => [...prev, { id: optimisticId, ...newMsg, time: new Date() }]);
    setMessage("");

    // Send to database
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      // Re-fetch to get official IDs and correct order
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div style={{
      position: "absolute",
      bottom: "20px",
      right: "20px",
      zIndex: 100,
      width: "clamp(280px, 25vw, 350px)",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none", // Let clicks pass through the main container
    }}>
      {/* Messages Area - Transparent overlay style */}
      <div 
        style={{
          maxHeight: "35vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "auto", // Enable scrolling/interacting within messages
          // Custom scrollbar hiding for cleaner look
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 100%)",
        }}
      >
        <style>
          {`
            .live-chat-messages::-webkit-scrollbar {
              display: none;
            }
            @keyframes slideUpFadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
        <div className="live-chat-messages" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '4px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: "column",
              animation: "slideUpFadeIn 0.3s ease-out forwards",
            }}>
              <div style={{
                display: "inline-block",
                alignSelf: "flex-start",
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                padding: "6px 12px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <span style={{ 
                  color: "#facc15", 
                  fontWeight: "bold", 
                  fontSize: "0.85rem",
                  marginRight: "8px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)"
                }}>
                  {msg.name}
                </span>
                <span style={{ 
                  color: "#fff", 
                  fontSize: "0.9rem",
                  fontFamily: "sans-serif",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  wordBreak: "break-word"
                }}>
                  {msg.text}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        pointerEvents: "auto", // Re-enable interaction for the form
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(8px)",
        padding: "10px",
        borderRadius: "12px",
        border: "1px solid rgba(212,160,23,0.3)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
      }}>
        <input
          type="text"
          placeholder="Your Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "6px 12px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            color: "#fff",
            outline: "none",
            fontFamily: "sans-serif",
            fontSize: "0.85rem",
            width: "50%",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            placeholder="Comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{
              flex: 1,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "20px",
              color: "#fff",
              outline: "none",
              fontFamily: "sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0 16px",
              background: "#b8860b",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#d4af37"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#b8860b"}
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
