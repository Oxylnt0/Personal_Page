const cards = document.querySelectorAll(".card");
const navItems = document.querySelectorAll(".top-nav li");

let currentCardIndex = 0;
let isScrolling = false;
let lightboxOpen = false;

let scrambleIntervals = new Map();

function scrambleText(element) {
    if (scrambleIntervals.has(element)) clearInterval(scrambleIntervals.get(element));

    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const originalText = element.dataset.original || element.textContent;
    element.dataset.original = originalText;

    let iterations = 0;
    const interval = setInterval(() => {
        element.textContent = originalText.split('')
            .map((c, i) => i < iterations ? originalText[i] : chars[Math.floor(Math.random() * chars.length)])
            .join('');

        iterations += 0.75;
        if (iterations >= originalText.length) {
            element.textContent = originalText;
            clearInterval(interval);
            scrambleIntervals.delete(element);
        }
    }, 30);

    scrambleIntervals.set(element, interval);
}

function showCard(index) {
    cards.forEach((card, i) => {
        card.classList.remove("active");
        if (i === index) {
            card.classList.add("active");
            card.querySelectorAll('.scramble-title').forEach(el => scrambleText(el));
        }
    });
}

function scrollHandler(e) {
    if (isScrolling || lightboxOpen) return;

    isScrolling = true;
    const delta = e.deltaY;

    currentCardIndex = delta > 0
        ? Math.min(cards.length - 1, currentCardIndex + 1)
        : Math.max(0, currentCardIndex - 1);

    showCard(currentCardIndex);

    setTimeout(() => isScrolling = false, 400);
}

window.addEventListener("wheel", scrollHandler, { passive: false });
window.addEventListener("wheel", e => {
    if (lightboxOpen) e.preventDefault();
}, { passive: false });

navItems.forEach(item => {
    item.addEventListener("click", () => {
        currentCardIndex = parseInt(item.dataset.index);
        showCard(currentCardIndex);
    });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const prevBtn = document.getElementById("prevImg");
const nextBtn = document.getElementById("nextImg");
const closeBtn = document.getElementById("closeLightbox");

let images = [];
let imgIndex = 0;

function openLightbox(imgArray, index) {
    images = Array.from(imgArray).map(i => i.src);
    imgIndex = index;
    lightboxImg.src = images[imgIndex];
    lightbox.classList.add("active");
    lightboxOpen = true;
}

document.querySelectorAll(".project-item").forEach(project => {
    const imgs = project.querySelectorAll("img");
    imgs.forEach((img, i) => {
        img.addEventListener("click", () => openLightbox(imgs, i));
    });
});

const certItems = document.querySelectorAll(".cert-item");

const certImgs = Array.from(certItems).map(item => item.querySelector("img"));

certItems.forEach((item, i) => {
    item.addEventListener("click", () => {
        openLightbox(certImgs, i); // pass the array of images and the clicked index
    });
});


prevBtn.addEventListener("click", () => {
    imgIndex = (imgIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[imgIndex];
});

nextBtn.addEventListener("click", () => {
    imgIndex = (imgIndex + 1) % images.length;
    lightboxImg.src = images[imgIndex];
});

closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxOpen = false;
});

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
        lightbox.classList.remove("active");
        lightboxOpen = false;
    }
});

showCard(currentCardIndex); 

function updateNavHighlight() {
    navItems.forEach((item, i) => {
        if (i === currentCardIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function showCard(index) {
    cards.forEach((card, i) => {
        card.classList.remove("active");
        if (i === index) {
            card.classList.add("active");
            card.querySelectorAll('.scramble-title').forEach(el => scrambleText(el));
        }
    });

    updateNavHighlight(); 
}

const planets = document.querySelectorAll(".space-nav .planet");

planets.forEach((planet, i) => {
    planet.addEventListener("click", () => {
        currentCardIndex = i;
        showCard(currentCardIndex);
        updatePlanets();
    });
});

function updatePlanets() {
    planets.forEach((p, i) => {
        if (i === currentCardIndex) {
            p.classList.add("active");
        } else {
            p.classList.remove("active");
        }
    });
}

showCard = ((original) => {
    return function(i) {
        original(i);
        updatePlanets();
    }
})(showCard);

setTimeout(updatePlanets, 200);


function generateBackgroundStars() {
    const container = document.querySelector(".background-stars");
    const count = 140; 

    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";

        star.style.animationDuration = (1.5 + Math.random() * 3) + "s";

        container.appendChild(star);
    }
}

generateBackgroundStars();


function spawnComet() {
    const comet = document.createElement("div");
    comet.classList.add("comet");

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight * 0.4; // top-ish only

    comet.style.left = startX + "px";
    comet.style.top = startY + "px";

    document.body.appendChild(comet);

    const distanceX = 300 + Math.random() * 400;
    const distanceY = 300 + Math.random() * 300;

    comet.animate(
        [
            { transform: "translate(0, 0)", opacity: 1 },
            { transform: `translate(${distanceX}px, ${distanceY}px)`, opacity: 0 }
        ],
        {
            duration: 1500 + Math.random() * 1000,
            easing: "ease-out"
        }
    );

    setTimeout(() => comet.remove(), 2500);
}

setInterval(() => {
    if (Math.random() < 0.7) spawnComet();
}, 3000);
