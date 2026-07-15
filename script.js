// ===========================
// Lumora AI
// Main JavaScript
// ===========================

// Dark Mode Toggle

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        themeToggle.textContent = "☀️";

    }

    else{

        themeToggle.textContent = "🌙";

    }

});

// Smooth Scroll

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({

            behavior:"smooth"

        });

    });

});

// Fade-in Animation

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

cards.forEach(card => {

    observer.observe(card);

});

// Button Effects

const buttons = document.querySelectorAll("button");

buttons.forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transform="scale(1.05)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="scale(1)";

    });

});

// Console Message

console.log("🚀 Welcome to Lumora AI");
