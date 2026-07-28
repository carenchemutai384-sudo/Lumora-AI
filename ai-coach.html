<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Study Coach | Lumora AI</title>
    <link rel="icon" type="image/png" href="images/favicon.png">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        .chat-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px 16px 40px;
        }

        .chat-window {
            background: var(--card-bg, #fff);
            border: 1.5px solid var(--border-light, #e2e8f0);
            border-radius: var(--radius-lg, 16px);
            height: 55vh;
            min-height: 320px;
            overflow-y: auto;
            padding: 18px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 14px;
        }

        .msg {
            max-width: 82%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.92rem;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        .msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--lumora-primary, #6366f1), var(--lumora-secondary, #a855f7));
            color: white;
            border-bottom-right-radius: 4px;
        }

        .msg.bot {
            align-self: flex-start;
            background: #f1f5f9;
            color: var(--text-main, #0f172a);
            border-bottom-left-radius: 4px;
        }

        .msg.typing {
            align-self: flex-start;
            background: #f1f5f9;
            color: var(--text-muted, #64748b);
            font-style: italic;
        }

        .chat-input-row {
            display: flex;
            gap: 10px;
        }

        .chat-input-row input {
            flex: 1;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1.5px solid #cbd5e1;
            font-size: 0.95rem;
        }

        .chat-input-row button {
            padding: 12px 20px;
            white-space: nowrap;
        }

        .suggestion-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }

        .suggestion-chip {
            background: #eef2ff;
            color: #4f46e5;
            border: 1px solid #c7d2fe;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 0.82rem;
            cursor: pointer;
        }
    </style>
</head>
<body>

<header>
    <div class="logo"><img src="images/logo.png" alt="Lumora AI"></div>
    <nav>
        <a href="index.html">Home</a>
        <a href="predict.html">Predict</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="study-plan.html">Study Plan</a>
        <a href="ai-coach.html" class="active">AI Coach</a>
        <a href="contact.html">Contact</a>
        <button id="themeToggle" aria-label="Toggle dark mode">🌙</button>
    </nav>
</header>

<section class="hero" style="min-height: 20vh;">
    <div class="hero-text">
        <h1>Your AI Study Coach</h1>
        <p>Ask questions, request practice problems, or get study advice — anytime.</p>
    </div>
</section>

<div class="chat-container">

    <div class="suggestion-chips">
        <span class="suggestion-chip" data-msg="Give me five Biology practice questions">📝 Practice questions</span>
        <span class="suggestion-chip" data-msg="Explain photosynthesis simply">💡 Explain a concept</span>
        <span class="suggestion-chip" data-msg="How should I split my study time this week?">📅 Study advice</span>
    </div>

    <div class="chat-window" id="chatWindow">
        <div class="msg bot">Hi! I'm your Lumora AI study coach. Ask me anything about your subjects, or tap a suggestion above to get started.</div>
    </div>

    <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Ask me anything...">
        <button class="primary-btn" id="sendBtn">Send</button>
    </div>

</div>

<footer>
    <div class="footer-content">
        <p>&copy; 2026 Lumora AI. All rights reserved.</p>
    </div>
</footer>

<script>
    const API_URL = 'https://lumora-ai-backend-jsvf.onrender.com/assistant';
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return div;
    }

    async function sendMessage(text) {
        if (!text.trim()) return;
        appendMessage(text, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;

        const typingEl = appendMessage('Thinking...', 'typing');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            typingEl.remove();

            if (!response.ok) throw new Error(data.error || 'The assistant is unavailable right now.');

            appendMessage(data.reply, 'bot');
        } catch (err) {
            typingEl.remove();
            appendMessage('Sorry, something went wrong: ' + err.message, 'bot');
        } finally {
            sendBtn.disabled = false;
        }
    }

    sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => sendMessage(chip.dataset.msg));
    });
</script>

<script src="js/theme-toggle.js"></script>
<script src="js/scroll-animations.js"></script>
</body>
</html>
