const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your frontend can talk to your backend
app.use(cors());
app.use(express.json());

// Serve your static frontend files (HTML, CSS, JS) automatically
app.use(express.static(path.join(__dirname, './')));

// The secure backend chat route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // This grabs the hidden API key safely from Render's environment
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
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
