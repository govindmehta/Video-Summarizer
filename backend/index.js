import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: `
        Summarize the following video transcript in **one or two sentences only**.  
        Extract only the **core message or key takeaway** of the video.  
        Avoid unnecessary details, examples, or long explanations.  
        Be as **concise and to the point** as possible.  
    ` });

// Route to summarize YouTube video
app.post("/summarize", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    // Extract Video ID from URL
    const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const videoId = videoIdMatch[1];

    // Fetch YouTube transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const fullTranscript = transcript.map((entry) => entry.text).join(" ");

    // Send transcript to Gemini AI for summarization
    const result = await model.generateContent(`Summarize the following transcript:\n\n${fullTranscript}`);
    const summary = result.response.text() || "Summary unavailable.";

    res.json({ summary });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to summarize video" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
