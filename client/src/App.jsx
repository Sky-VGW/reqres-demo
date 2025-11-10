import { useState, useEffect } from 'react'

export default function App() {
  const [message, setMessage] = useState("Loading...");
  const [input, setInput] = useState("");
  const [error, setError] = useState(null); // ✅ show server or validation errors

  // Fetch initial message on mount
  useEffect(() => {
    async function loadMessage() {
      try {
        const res = await fetch("http://localhost:4000/api/message");
        const data = await res.json();

        console.log("📬 GET response:", data);
        setMessage(data.message);

      } catch (err) {
        console.error("❌ GET error:", err);
        setError("Failed to load message from server.");
      }
    }

    loadMessage();
  }, []);

  // Handle sending message to server
  async function sendMessage() {
    setError(null);

    // Client-side form validation
    if (input.trim() === "") {
      setError("Message cannot be empty.");
      return;
    }

    try {
      console.log("📤 Sending POST request...");
      const res = await fetch("http://localhost:4000/api/massage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        // display server error messages
        setError(data.error || "Unknown server error");
        return;
      }

      console.log("📥 POST response:", data);
      setMessage(data.message);
      setInput("");
      
    } catch (err) {
      console.error("❌ POST error:", err);
      setError("Could not reach the server.");
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>🌐 Client–Server Communication Demo</h1>
      <p><strong>Server says:</strong> {message}</p>

      {/* ✅ Error display */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send to Server</button>

      <hr />
      <p style={{ fontSize: "0.9rem", color: "gray" }}>
        Open your browser console and server terminal to watch the request-response cycle!
      </p>
    </div>
  );
}
