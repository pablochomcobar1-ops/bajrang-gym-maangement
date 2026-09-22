const { chatWithBot } = require("../services/aiService");

// @desc   Chat with the AI gym assistant
// @route  POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chatWithBot(history || [], message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to get response", error: error.message });
  }
};

module.exports = { sendMessage };
