import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_OPENAI_API_KEY;
console.log('API Key exists:', !!apiKey);
console.log('First 10 chars:', apiKey ? apiKey.substring(0, 10) : 'No key');

const openai = new OpenAI({
  apiKey: apiKey
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, OpenAI is working!"' }
      ],
      max_tokens: 50
    });
    
    console.log('Success! Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testOpenAI();