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

app.post("/cover-letter", async (req, res) => {
  try {
    const { template, applicantName, jobTitle, companyName, skills, reason } = req.body;

    if (!template || !applicantName || !jobTitle || !companyName || !skills || !reason) {
      return res.status(400).json({
        error: "Template, applicant name, job title, company name, skills, and reason are required."
      });
    }

    const prompt = `
Write a professional cover letter for a user in Sierra Leone.

Details:
- Template style: ${template}
- Applicant name: ${applicantName}
- Job title: ${jobTitle}
- Company or organization: ${companyName}
- Skills: ${skills}
- Reason for applying: ${reason}

Instructions:
- Make the letter human, professional, and clear
- Match the tone to the selected template
- Keep it practical and realistic
- Do not use overly complex grammar
- Make it sound like a real application letter
- End with the applicant's name
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
            content: "You are Salone Hustle AI. Write strong, realistic cover letters for jobs, NGOs, and government roles in a simple professional style."
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

app.post("/interview-practice", async (req, res) => {
  try {
    const { jobTitle, userAnswer } = req.body;

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({
        error: "Job title is required."
      });
    }

    const prompt = userAnswer && userAnswer.trim()
      ? `
A Sierra Leone user is preparing for an interview.

Job title: ${jobTitle}
User's answer: ${userAnswer}

Instructions:
- Briefly review the answer
- Say what is good about it
- Say what should improve
- Give a stronger sample answer
- Keep it practical, encouraging, and easy to understand
`
      : `
A Sierra Leone user is preparing for an interview.

Job title: ${jobTitle}

Instructions:
- Generate 5 realistic interview questions for this role
- Add short guidance on how to answer them well
- Keep it simple, practical, and professional
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
            content: "You are Salone Hustle AI. Help users prepare for interviews with realistic questions, answer feedback, and practical coaching."
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

app.post("/cv", async (req, res) => {
  try {
    const {
      template,
      fullName,
      phone,
      email,
      address,
      education,
      skills,
      experience
    } = req.body;

    if (
      !template ||
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !education ||
      !skills ||
      !experience
    ) {
      return res.status(400).json({
        error: "Template, full name, phone, email, address, education, skills, and experience are required."
      });
    }

    const prompt = `
Write a professional CV for a Sierra Leone user.

Details:
- CV template style: ${template}
- Full name: ${fullName}
- Phone: ${phone}
- Email: ${email}
- Address: ${address}
- Education: ${education}
- Skills: ${skills}
- Work experience: ${experience}

Instructions:
- Write a clean, realistic CV
- Match the tone to the selected template
- Improve wording of skills and experience
- Add a short professional summary or career objective where appropriate
- Keep it practical and readable
- Do not use overly complex grammar
- Return the CV in plain text, well structured with headings
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
            content: "You are Salone Hustle AI. Write strong, practical, realistic CVs for jobs, NGOs, and government applications in a clear professional style."
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