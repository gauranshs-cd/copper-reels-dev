import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
console.log('Gemini API Key exists:', !!apiKey);
console.log('First 10 chars:', apiKey ? apiKey.substring(0, 10) : 'No key');

if (!apiKey) {
  console.error('No Gemini API key found in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function testGemini() {
  try {
    console.log('Testing Gemini connection...');
    
    const prompt = 'Say "Hello, Gemini is working!" and nothing else.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Success! Response:', text);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Details:', error.response);
    }
  }
}

testGemini();