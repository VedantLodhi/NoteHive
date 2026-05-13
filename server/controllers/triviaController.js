const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

function extractJsonArray(text) {
  const trimmed = String(text).trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const inner = fence ? fence[1].trim() : trimmed;
  const start = inner.indexOf("[");
  const end = inner.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in model response");
  }
  return inner.slice(start, end + 1);
}

const generateTrivia = async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const { topic, difficulty, numQuestions } = req.body;

    if (!topic || !difficulty || !numQuestions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    console.log("Using Gemini Model: gemini-2.0-flash");

    const prompt = `Generate ${numQuestions} unique multiple-choice quiz questions on the topic of ${topic} at ${difficulty} difficulty level.
    The questions should be different each time and should vary in phrasing. 
    Ensure diversity in the questions and options.

    Format the response as a *pure JSON array* without any markdown or code block formatting. Example:
    [
      { "question": "What is a REST API?", "options": ["A", "B", "C", "D"], "answer": "A" }
    ]`;

    const result = await model.generateContent(prompt);
    // const textResponse = result.response.text();
    const response = await result.response;
const textResponse = response.text();

console.log("Gemini Response:", textResponse);

    const cleanedJSON = extractJsonArray(textResponse);
    const quizData = JSON.parse(cleanedJSON);

    if (!Array.isArray(quizData)) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.json({ quizzes: quizData });
  } catch (error) {
    console.error("Trivia Generation Error:", error);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }
    // res.status(500).json({ error: "Failed to generate quiz" });
    res.status(500).json({
      error: error.message || "Failed to generate quiz",
    });
  }
};

module.exports = { generateTrivia };
