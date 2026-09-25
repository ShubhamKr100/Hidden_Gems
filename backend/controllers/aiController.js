// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Review = require("../models/Review"); // Apna Review model import karo

// // Gemini Setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const summarizeReviews = async (req, res) => {
//   const { hostId } = req.body;

//   try {
//     // 1. Database se us Host ke reviews nikalo
//     const reviews = await Review.find({ host: hostId }).limit(20); // Last 20 reviews kaafi hain

//     // 2. Agar reviews kam hain, toh AI ki zarurat nahi
//     if (!reviews || reviews.length < 3) {
//       return res.json({ summary: "Not enough reviews to generate a summary yet." });
//     }

//     // 3. Reviews ka text ek saath jodo
//     const reviewsText = reviews.map((r) => r.comment).join("\n");

//     // 4. Prompt Engineering (AI ko strict instruction do)
//     const prompt = `
//       Here are some reviews for a home-kitchen/host:
//       "${reviewsText}"

//       Task: Summarize these reviews into 3 short concise bullet points highlighting:
//       1. Food Quality (Taste)
//       2. Hospitality/Behavior
//       3. Any Negative point (if exists)

//       Use emojis (✅, 🍲, ⚠️) for better readability. Keep it very short.
//     `;

//     // 5. AI ko call karo (Flash model fast hai)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const summary = response.text();

//     // 6. Jawab bhejo
//     res.json({ summary });

//   } catch (error) {
//     console.error("AI Error:", error);
//     res.status(500).json({ message: "Summary generate nahi ho payi." });
//   }
// };

// module.exports = { summarizeReviews };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const HostProfile = require("../models/HostProfile");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Review Summarizer
const summarizeReviews = asyncHandler(async (req, res) => {
  const { hostId } = req.body;

  try {
    const reviews = await Review.find({ host: hostId }).limit(20);

    if (!reviews || reviews.length < 3) {
      return res.json({ summary: "Not enough reviews to generate a summary yet." });
    }

    const reviewsText = reviews.map((r) => r.comment).join("\n");

    const prompt = `
      Here are some reviews for a home-kitchen/host:
      "${reviewsText}"

      Task: Summarize these reviews into 3 short concise bullet points highlighting:
      1. Food Quality (Taste)
      2. Hospitality/Behavior
      3. Any Negative point (if exists)
      Use emojis and keep it brief.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ summary: response.text() });
  } catch (error) {
    console.error("AI Summarizer Error:", error);
    res.status(500).json({ message: "AI generation failed: " + error.message });
  }
});

// 2. Smart Search Recommendations
const getAIRecommendations = asyncHandler(async (req, res) => {
  const { query } = req.body;

  try {
    const allHosts = await HostProfile.find({}).select("kitchenName city mealPrice mealDescription stayPrice stayDescription _id");
    const hostsString = JSON.stringify(allHosts);

    const prompt = `
      Act as a smart food and travel guide.
      Here is the list of available hosts in JSON format: ${hostsString}
      
      User Request: "${query}"
      
      Task: Find top 3 hosts that best match the request.
      Strict Output Rules:
      - Return ONLY a JSON array of matching host _ids.
      - No explanation.
      - Example: ["id1", "id2"]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    let suggestedIds = [];
    try {
      suggestedIds = JSON.parse(text);
    } catch (e) {
      suggestedIds = [];
    }

    const recommendedHosts = await HostProfile.find({ _id: { $in: suggestedIds } });
    res.json(recommendedHosts);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ message: "AI failed to fetch recommendations" });
  }
});

module.exports = { summarizeReviews, getAIRecommendations };