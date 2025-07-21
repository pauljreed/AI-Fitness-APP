
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

const fetchAIResponse = async (prompt) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer YOUR_OPENAI_API_KEY`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
};

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">Your AI Personal Trainer & Nutritionist</h1>
      <p className="text-lg mb-8 text-center">Custom workouts, meals, and AI coaching — affordable and personalised.</p>
      <button className="bg-purple-600 hover:bg-purple-800 px-6 py-3 rounded-xl font-bold" onClick={() => navigate("/onboarding")}>
        Start Free Today
      </button>
    </div>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ age: '', gender: '', height: '', weight: '', goal: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    localStorage.setItem("userData", JSON.stringify(form));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Let's Build Your Program</h2>
      <div className="flex flex-col space-y-4">
        <input className="p-3 bg-gray-800 rounded" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <input className="p-3 bg-gray-800 rounded" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
        <input className="p-3 bg-gray-800 rounded" name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} />
        <input className="p-3 bg-gray-800 rounded" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} />
        <input className="p-3 bg-gray-800 rounded" name="goal" placeholder="Goal (e.g. Lose fat)" value={form.goal} onChange={handleChange} />
        <button className="bg-purple-600 hover:bg-purple-800 px-6 py-3 rounded-xl font-bold" onClick={handleSubmit}>Submit & Start</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleAskCoach = async () => {
    setLoading(true);
    const userPrompt = `You are a fitness and nutrition coach. User stats: Age ${userData.age}, Gender ${userData.gender}, Height ${userData.height}cm, Weight ${userData.weight}kg, Goal: ${userData.goal}. Question: ${prompt}`;
    const reply = await fetchAIResponse(userPrompt);
    setAIResponse(reply);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Welcome Back, Champion</h2>
      <div className="mb-4">
        <p>Goal: {userData.goal}</p>
      </div>
      <div className="p-4 bg-gray-900 rounded-xl mb-4">
        <h3 className="text-xl font-bold mb-2">AI Coach Chat</h3>
        <textarea className="w-full p-3 rounded bg-gray-800 mb-4" rows="4" placeholder="Ask your AI Coach a question..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
        <button className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-xl font-bold" onClick={handleAskCoach}>
          {loading ? "Thinking..." : "Ask Coach"}
        </button>
        {aiResponse && (
          <div className="mt-4 p-4 bg-gray-800 rounded-xl">
            <p className="text-green-400 font-bold">Coach Says:</p>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
