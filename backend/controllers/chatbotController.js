import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const predefinedResponses = {
  "What are the property prices in my area?": "Property prices vary by location. Could you specify your city or neighborhood?",
  "How can I schedule a property visit?": "You can schedule a property visit by contacting our agent at +123-456-7890.",
  "What documents do I need to buy a house?": "You will need ID proof, income statements, and bank details. Contact our team for a detailed list.",
  "Do you offer mortgage assistance?": "Yes, we have tie-ups with multiple banks to help with mortgages. Would you like more details?",
};

export const chatWithBot = async (req, res) => {
  try {
    const { message, userName } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for predefined responses
    if (predefinedResponses[message]) {
      return res.json({ botMessage: predefinedResponses[message] });
    }

    // Handle greeting
    if (message.toLowerCase() === "hi") {
      return res.json({
        botMessage: "Hi! How can I help you today? 😊\nPlease enter your name to continue.",
        askName: true,
      });
    }

    // Save user's name and personalize messages
    if (!userName && message.trim().length > 1) {
      return res.json({
        botMessage: `Nice to meet you, ${message}! How can I assist you today?`,
        userName: message,
      });
    }

    // Call OpenAI API (only if the user enters a custom message)
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `${userName ? `Hi ${userName}, ` : ''}${message}`,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ botMessage: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
