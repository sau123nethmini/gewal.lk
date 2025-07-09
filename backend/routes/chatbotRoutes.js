import express from 'express';
import { chatWithBot } from '../controllers/chatbotController.js';

const router = express.Router();

// Define chatbot API route
router.post('/', chatWithBot);

export default router;
