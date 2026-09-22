const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateFitnessPlan = async ({
  age,
  weight,
  height,
  goal,
  experience,
  dietPreference,
  injuries,
}) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `
You are a certified fitness coach. Create a simple weekly workout plan and a basic daily diet plan for a person with these details:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Experience level: ${experience}
- Dietary preference: ${dietPreference}
- Injuries or limitations: ${injuries || "None"}

Take the experience level into account for exercise difficulty and volume. Respect the dietary preference strictly in all meal suggestions. If injuries or limitations are mentioned, avoid exercises that could aggravate them and suggest safe alternatives.

Respond ONLY in valid JSON, with this exact structure and nothing else (no markdown, no explanation):
{
  "workoutPlan": [
    { "day": "Monday", "focus": "string", "exercises": ["string", "string"] }
  ],
  "dietPlan": {
    "breakfast": "string",
    "lunch": "string",
    "dinner": "string",
    "snacks": "string"
  },
  "notes": "string"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

// NEW: Chatbot function
const chatWithBot = async (history, newMessage) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction:
      "You are the friendly, knowledgeable gym assistant chatbot for Bajrang GYM. Help users with fitness, nutrition, and gym-related questions. Keep answers concise and practical. If asked something completely unrelated to fitness/health/gym topics, politely redirect the conversation back.",
  });

  // Start a chat session with the previous conversation history
  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
  });

  const result = await chat.sendMessage(newMessage);
  return result.response.text();
};

// Retries a function a few times with a short delay if it fails
const retryWithDelay = async (fn, retries = 4, delayMs = 3000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isOverloaded =
        error.message?.includes("503") || error.message?.includes("overloaded");
      if (isOverloaded && attempt < retries) {
        console.log(
          `Model overloaded, retrying... (attempt ${attempt + 1}/${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
};
module.exports = { generateFitnessPlan, chatWithBot, retryWithDelay }; // UPDATE this line
