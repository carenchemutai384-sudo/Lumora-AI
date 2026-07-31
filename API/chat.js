export default async function handler(req, res) {
  // 1. Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    // 2. Grab the hidden API key from Vercel's environment variables
    const apiKey = process.env.GEMINI_API_KEY; 

    // 3. Securely call the Gemini API from the backend
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
