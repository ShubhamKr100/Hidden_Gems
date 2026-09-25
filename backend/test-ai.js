require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("❌ Error: API Key missing in .env");
    return;
  }
  
  console.log("🔑 Testing Key:", apiKey.slice(0, 10) + "...");

  const genAI = new GoogleGenerativeAI(apiKey);

  // Hum 3 sabse common models try karenge bari-bari se
  const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

  for (const modelName of modelsToTry) {
    console.log(`\n👉 Testing Model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you working?");
      const response = await result.response;
      console.log(`✅ SUCCESS! ${modelName} is working.`);
      console.log("Response:", response.text());
      return; // Agar ek bhi chal gaya toh yahin ruk jayenge
    } catch (error) {
      console.log(`❌ Failed: ${modelName}`);
      if (error.message.includes("404")) {
        console.log("   Reason: Model Not Found for this Key.");
      } else {
        console.log("   Reason:", error.message.split('[')[0]);
      }
    }
  }
  
  console.log("\n⚠️ KOI BHI MODEL NAHI CHALA. Problem API Key ya Google Cloud Project mein hai.");
}

checkModels();