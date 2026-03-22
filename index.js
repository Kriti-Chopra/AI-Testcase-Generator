import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Call Ollama local API
async function callAI(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral",
      prompt: prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response;
}

app.get("/", (req, res) => {
  res.send("AI Test Case Generator Running");
});

app.post("/generate", async (req, res) => {
  const userStory = req.body.text;
  const prompt = `
You are a Senior QA Engineer.

Generate test cases from the user story.

Rules:
- Include positive, negative, edge cases
- Return JSON format only

User Story:
${userStory}
`;

  try {
    const aiResponse = await callAI(prompt);

    res.json({
      test_cases: aiResponse
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
