import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());            // allow requests from React dev server
app.use(express.json());    // parse incoming JSON

// In-memory "database"
const messages = ["Welcome to the server!"];

// --- GET Route ---
app.get("/api/message", (req, res) => {
  try {
    console.log("✅ GET /api/message");

    const latest = messages[messages.length - 1];
    return res.json({ message: latest });

  } catch (err) {
    console.error("❌ Error in GET /api/message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- POST Route ---
app.post("/api/message", (req, res) => {
  try {
    const { text } = req.body
    console.log("✅ POST /api/message:", text);


    // ✅ server-side validation
    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    } else if (text === 'ban me') {
      return res.status(406).json({ error: "You've been banned" });
    }

    messages.push(text.trim());
    return res.status(201).json({ message: `Server received: "${text}"` });

  } catch (err) {
    console.error("❌ Error in POST /api/message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});