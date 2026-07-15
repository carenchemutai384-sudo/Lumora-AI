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
    themeToggle.textContent = "☀️";
}

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

// ------------------------------
// Smooth Scrolling
// ------------------------------

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({

            behavior: "smooth"

        });

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

    form.addEventListener("submit",
