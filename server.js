const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your frontend can communicate with the backend
app.use(cors());
app.use(express.json());

// Serve static frontend files (CSS, images, JS) automatically from the current folder
app.use(express.static(path.join(__dirname, './')));

// Explicitly serve your index.html file on the root URL path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Secure backend chat route that communicates with the Gemini API
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Grab the hidden API key safely from Render's environment variables
        const apiKey = process.env.GEMINI_API_KEY; 

        if (!apiKey) {
            return res.status(500).json({ error: "API key is missing on the server." });
        }

        // Make the secure call to Gemini from the backend
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
        res.json(data);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
