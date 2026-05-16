const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function extractJsonArray(text) {
  const trimmed = String(text).trim();

  const cleaned = trimmed
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in model response");
  }

  return cleaned.slice(start, end + 1);
}

const generateTrivia = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic || !difficulty || !numQuestions) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    console.log(
      "Using Model:",
      process.env.OPENAI_MODEL || "openrouter/free"
    );

 const prompt = `
Generate ${numQuestions} unique multiple-choice quiz questions on "${topic}" with ${difficulty} difficulty.

IMPORTANT RULES:
- Each question must have 4 meaningful options.
- NEVER use A,B,C,D as actual option values.
- Options should contain real answers.
- Answer must exactly match one option.

Return ONLY valid JSON.

Example:

[
 {
   "question":"What is the time complexity of Binary Search?",
   "options":[
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(1)"
   ],
   "answer":"O(log n)"
 }
]

No markdown
No explanation
No code blocks
`;

    const completion =
      await client.chat.completions.create({
        model:
          process.env.OPENAI_MODEL ||
          "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.9,
      });

    const textResponse =
      completion.choices[0].message.content;

    console.log(
      "AI Response:",
      textResponse
    );

    const cleanedJSON =
      extractJsonArray(textResponse);

    const quizData =
      JSON.parse(cleanedJSON);
 
      console.log(
  JSON.stringify(quizData, null, 2)
);

    if (
      !quizData ||
      !Array.isArray(quizData) ||
      quizData.length === 0
    ) {
      return res.status(500).json({
        error: "Quiz generation failed",
      });
    }

    res.json({
      quizzes: quizData,
    });

  } catch (error) {
    console.error(
      "Trivia Generation Error:",
      error.message
    );

    res.status(500).json({
      error:
        error.message ||
        "Failed to generate quiz",
    });
  }
};

module.exports = {
  generateTrivia,
};