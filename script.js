// ==========================================
// Lumora AI
// Main JavaScript File
// Version 1.0
// ==========================================

// ------------------------------
// Theme Toggle with Local Storage
// ------------------------------
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }
    });
}

// ------------------------------
// Smooth Scrolling
// ------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute("href"));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// ------------------------------
// Reveal Elements on Scroll
// ------------------------------
const revealElements = document.querySelectorAll(".card, .stat, .about, .cta, .contact");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ------------------------------
// Animated Statistics Counter
// ------------------------------
const counters = document.querySelectorAll(".stat h2");
const speed = 60;

counters.forEach(counter => {
    const updateCounter = () => {
        const targetText = counter.innerText;

        if (targetText.includes("%")) {
            const target = parseInt(targetText);
            let count = +counter.getAttribute("data-count") || 0;

            if (count < target) {
                count++;
                counter.setAttribute("data-count", count);
                counter.innerText = count + "%";
                setTimeout(updateCounter, speed);
            }
        }
    };
    updateCounter();
});

// ------------------------------
// Contact Form Validation
// ------------------------------
const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", (e) => {
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector('textarea');
        let isValid = true;

        if (nameInput && !nameInput.value.trim()) isValid = false;
        if (emailInput && !emailInput.value.trim()) isValid = false;
        if (messageInput && !messageInput.value.trim()) isValid = false;

        if (!isValid) {
            e.preventDefault();
            alert("Please fill out all fields before sending.");
        }
    });
}

// ------------------------------
// Chat Functionality (Lumora AI)
// ------------------------------
const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Helper function to append a message bubble
function appendMessage(text, sender) {
    if (!chatWindow) return null;
    
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("msg", sender);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    
    // Auto-scroll to the latest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msgDiv;
}

// Function to handle sending the message
async function handleSend() {
    if (!chatInput || !chatWindow) return;

    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // 1. Display user message and clear input
    appendMessage(messageText, "user");
    chatInput.value = "";

    // 2. Display a temporary "Thinking..." bubble for the bot
    const thinkingBubble = appendMessage("Thinking...", "bot");

    try {
        // 3. Call your secure Render backend API endpoint
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();

        // 4. Remove the thinking indicator
        if (thinkingBubble) thinkingBubble.remove();

        if (response.ok) {
            // Extract the generated text from Gemini's JSON response structure
            const botResponse = data.candidates[0].content.parts[0].text;
            appendMessage(botResponse, "bot");
        } else {
            // Handle server errors cleanly without exposing keys
            appendMessage("Sorry, something went wrong on the server. Please try again.", "bot");
        }

    } catch (error) {
        // Remove thinking indicator and handle network failures
        if (thinkingBubble) thinkingBubble.remove();
        appendMessage("Network error. Please check your connection and try again.", "bot");
    }
}

// Event Listeners for sending messages
if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
}

if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSend();
        }
    });
}
