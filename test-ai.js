
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  try {
    console.log('Testing Gemini API with key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent('Say hello world');
    const response = await result.response;
    const text = response.text();
    
    console.log('\n--- SUCCESS ---');
    console.log('AI Response:', text);
  } catch (error) {
    console.error('\n--- ERROR ---');
    console.error(error.message);
  }
}

testAI();
