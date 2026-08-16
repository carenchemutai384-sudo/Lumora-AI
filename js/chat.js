/* ====================================================
   LUMORA AI — AI COACH CHAT
   Talks to the Flask backend's /assistant endpoint,
   which safely holds the Gemini API key server-side.
   Include on any page with the chat widget, right
   before </body>:
   <script src="js/chat.js"></script>
==================================================== */

(function () {
  const API_URL = 'https://lumora-ai-backend-jsvf.onrender.com/assistant';

  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  if (!chatWindow || !chatInput || !sendBtn) return; // chat widget not on this page

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msg;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;

    const thinkingMsg = addMessage('Thinking...', 'bot');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      thinkingMsg.textContent = data.reply;

    } catch (err) {
      thinkingMsg.textContent = `Sorry, something went wrong: ${err.message}`;
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
