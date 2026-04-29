let provinces = [];
let currentFilter = "all";
let searchText = "";

const grid = document.getElementById("provinceList");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const chips = document.querySelectorAll(".chip");
const toTopBtn = document.getElementById("toTopBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsCount = document.getElementById("resultsCount");

const loadProvinces = async () => {
    try {
        const response = await fetch("data/provinces.json");
        const data = await response.json();

        provinces = data.provinces || [];
        displayProvinces(provinces);

    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p style='color:red'>Failed to load provinces.</p>";
    }
};

// Hero slider
const initHeroSlider = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    // Prevent duplicate init
    if (hero.querySelector(".slideshow-container")) return;

    hero.innerHTML = "";
        const slides = [
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg',
            title: 'Welcome to Cambodia',
            desc: 'Experience the breathtaking beauty of the ancient temple to the stunning coastal beaches and vibrant city life.'
        },
        {
            url: 'https://www.hotelscombined.com/rimg/dimg/dynamic/314-2020-10-a2aef2e65d144694cb72e3f751d6333d.webp',
            title: 'Phnom Penh City',
            desc: 'Vibrant capital city blending tradition and modernity'
        },
        {
            url: 'https://grantourismotravels.com/wp-content/uploads/2017/08/Cambodian-Food-Sugar-Palm-Siem-Reap-Copyright-2022-Terence-Carter-Grantourismo-T.jpg',
            title: 'Traditional Food',
            desc: 'Unforgettable taste of traditional Cambodia\'s cuisine'
        },
        {
            url: 'https://www.historytoday.com/sites/default/files/reviews/Cambodia.jpg',
            title: 'History',
            desc: 'Learn the country history that marked by periods of peace and great calamity',
        },
        {
            url: 'https://cdn.jacadatravel.com/wp-content/uploads/bis-images/442849/cambodia-tree-temple-AdobeStock_339563025-2400x1400-f50_50.jpg',
            title: 'Temple Ruins',
            desc: 'Ancient Khmer architecture and history'
        },
        {
            url: 'https://images.pexels.com/photos/28912613/pexels-photo-28912613/free-photo-of-relaxing-beach-day-in-sihanoukville-cambodia.jpeg',
            title: 'Coastal Beach',
            desc: 'Pristine white sand beaches and crystal clear waters'
        },
        {
            url: 'https://static.saltinourhair.com/wp-content/uploads/2016/07/23165132/cambodia-island-kohrong-sunset-couple.jpg',
            title: 'Tropical Paradise',
            desc: 'Relax and unwind in Cambodia\'s coastal gems'
        },
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Cambodia%27s_rice_fields.jpg',
            title: 'Rice Field',
            desc: 'Lush green landscapes and rural beauty'
        },
        {
            url: 'https://www.guidingcambodia.com/wp-content/uploads/2023/12/Phnom-Kulen-Waterfall-02-853x640-1.jpg',
            title: 'Jungle Waterfall',
            desc: 'Hidden natural wonders waiting to be explored'
        }
    ];

    let currentIndex = 0;

    //Slide container
    const container = document.createElement("div");
    container.className = "slideshow-container";

    const slideElements = [];
    const dotElements = [];

    slides.forEach((slide, i) => {
        const slideDiv = document.createElement("div");
        slideDiv.className = "slide";
        if (i === 0) slideDiv.classList.add("active");

        const img = document.createElement("img");
        img.src = slide.url;

        slideDiv.appendChild(img);
        container.appendChild(slideDiv);

        slideElements.push(slideDiv);
    });

    hero.appendChild(container);

    // Dots
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "slideshow-dots";

    slides.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
            showSlide(i);
            resetTimer();
        });

        dotsContainer.appendChild(dot);
        dotElements.push(dot);
    });

    hero.appendChild(dotsContainer);

    // Overlay section
    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";

    overlay.innerHTML = `
        <div class="hero-overlay-content">
            <h1 id="slideTitle">${slides[0].title}</h1>
            <p id="slideDesc">${slides[0].desc}</p>
        </div>
    `;

    hero.appendChild(overlay);

    const titleEl = overlay.querySelector("#slideTitle");
    const descEl = overlay.querySelector("#slideDesc");

    //Slide Change Function
    const showSlide = (index) => {
        slideElements.forEach(s => s.classList.remove("active"));
        dotElements.forEach(d => d.classList.remove("active"));

        slideElements[index].classList.add("active");
        dotElements[index].classList.add("active");

        // Fade text effect
        titleEl.style.opacity = "0";
        descEl.style.opacity = "0";

        setTimeout(() => {
            titleEl.textContent = slides[index].title;
            descEl.textContent = slides[index].desc;
            titleEl.style.opacity = "1";
            descEl.style.opacity = "1";
        }, 300);

        currentIndex = index;
    };

    const nextSlide = () => {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
    };

    // Auto-slide every 4 seconds
    let interval = setInterval(nextSlide, 4000);

    const resetTimer = () => {
        clearInterval(interval);
        interval = setInterval(nextSlide, 4000);
    };
};

const displayProvinces = (list) => {
    grid.innerHTML = "";

    if (resultsCount) {
        resultsCount.textContent =
            list.length === provinces.length
                ? `Showing all ${list.length} results`
                : `${list.length} results`;
    }

    if (list.length === 0) {
        grid.innerHTML = "<p>No provinces found.</p>";
        return;
    }

    const favs = JSON.parse(localStorage.getItem("sabaytrip_favs") || "[]");

    list.forEach(province => {
        const card = document.createElement("div");
        card.className = "card";

        const isFav = favs.includes(province.name);

        card.innerHTML = `
            <div class="card-img">
                <img src="${province.img || "https://placehold.co/600x400"}">
                <button class="heart-btn ${isFav ? "loved" : ""}" data-name="${province.name}">
                    ${isFav ? "♥" : "♡"}
                </button>
            </div>

            <div class="card-content">
                <h3>${province.name}</h3>
                <p>${province.description || "Explore this destination."}</p>
                <a href="explore.html?province=${encodeURIComponent(province.name)}" class="plan-btn">
                    Plan Trip
                </a>
            </div>
        `;

        const heartBtn = card.querySelector(".heart-btn");
        heartBtn.addEventListener("click", (e) => {
            e.preventDefault();

            let saved = JSON.parse(localStorage.getItem("sabaytrip_favs") || "[]");

            if (saved.includes(province.name)) {
                saved = saved.filter(n => n !== province.name);
                heartBtn.textContent = "♡";
                heartBtn.classList.remove("loved");
            } else {
                saved.push(province.name);
                heartBtn.textContent = "♥";
                heartBtn.classList.add("loved");
            }

            localStorage.setItem("sabaytrip_favs", JSON.stringify(saved));
        });

        grid.appendChild(card);
    });
};

const applyFilters = () => {
    let filtered = provinces;

    // Search
    if (searchText !== "") {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    if (currentFilter !== "all") {

        if (currentFilter === "popular") {
            filtered = filtered.filter(p => p.tag === "Most Popular");
        }

        else if (currentFilter === "coastal") {
            const coastal = ["Sihanoukville", "Kampot", "Kep", "Koh Kong"];
            filtered = filtered.filter(p => coastal.includes(p.name));
        }

        else if (currentFilter === "nature") {
            const nature = ["Mondulkiri", "Ratanakiri", "Kratie"];
            filtered = filtered.filter(p => nature.includes(p.name));
        }

        else if (currentFilter === "city") {
            const city = ["Phnom Penh", "Siem Reap", "Battambang"];
            filtered = filtered.filter(p => city.includes(p.name));
        }
    }

    displayProvinces(filtered);
};

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchText = searchInput.value.trim();
    applyFilters();
});

searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    applyFilters();

    clearBtn.classList.toggle("visible", searchText !== "");
});

clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchText = "";
    clearBtn.classList.remove("visible");
    applyFilters();
});

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        currentFilter = chip.dataset.filter;
        applyFilters();
    });
});

window.addEventListener("scroll", () => {
    document.querySelector("nav")
        .classList.toggle("scrolled", window.scrollY > 50);

    toTopBtn.classList.toggle("show", window.scrollY > 300);
});

toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    loadProvinces();
});

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});
