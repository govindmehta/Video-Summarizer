import { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("Summary will appear here...");
  const [loading, setLoading] = useState<boolean>(false);

  const summarizeVideo = async () => {
    if (!videoUrl) {
      alert("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/summarize", { url: videoUrl });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Failed to fetch summary.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🎥 YouTube Video Summarizer</h1>
      <input
        type="text"
        placeholder="Enter YouTube Video URL..."
        className="p-2 w-80 border border-gray-500 rounded text-black"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button
        onClick={summarizeVideo}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      <div className="mt-6 p-4 bg-gray-800 rounded w-full max-w-2xl">
        <h2 className="text-lg font-semibold">Summary:</h2>
        <p className="mt-2">{summary}</p>
      </div>
    </div>
  );
};

export default App;
