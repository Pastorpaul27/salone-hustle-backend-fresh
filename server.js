import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("Salone Hustle AI backend is running.");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Salone Hustle AI. Help with CVs, cover letters, interviews, business ideas, jobs, and skills in a simple practical way for Sierra Leone users."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: data.error?.message || "Groq request failed."
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response received.";
    res.json({ reply });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

app.post("/business-idea", async (req, res) => {
  try {
    const { budget, location, interest } = req.body;

    if (!budget || !location || !interest) {
      return res.status(400).json({ error: "Budget, location, and interest are required." });
    }

    const prompt = `
Suggest a realistic small business idea in Sierra Leone.

User details:
- Budget: ${budget} SLE
- Location: ${location}
- Interest: ${interest}

Instructions:
- Give one strong business idea
- Explain why it fits the location and budget
- List startup items needed
- Mention target customers
- Give simple practical advice
- Keep it easy to understand
- Write in a helpful, human, encouraging tone
`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Salone Hustle AI. Give practical small business advice for Sierra Leone users."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: data.error?.message || "Groq request failed."
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response received.";
    res.json({ reply });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});