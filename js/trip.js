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

const loadProvinces = async() => {
    try {
        const response = await fetch('data/provinces.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.provinces || !Array.isArray(data.provinces)) {
            throw new Error("Invalid data format");
        }

        provinces = data.provinces;
        displayProvinces(provinces); 

    } catch (error) {
        console.error("Error loading:", error);
        grid.innerHTML = "<p style='color:red'>Failed to load provinces. Please refresh.</p>";
    }
}

// Slideshow
const initHeroSlider = () => {
    const heroSection = document.querySelector('.hero');

    if (!heroSection) return;
    if (heroSection.querySelector('.slideshow-container')) return;
    
    // Clear existing content in hero
    heroSection.innerHTML = '';
    
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
    
    const slideshowContainer = document.createElement('div');
    slideshowContainer.className = 'slideshow-container';
    
    // Create slides
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        if (index === 0) slideDiv.classList.add('active');
        
        const img = document.createElement('img');
        img.src = slide.url;
        img.alt = slide.title;
        
        slideDiv.appendChild(img);
        slideshowContainer.appendChild(slideDiv);
    });
    
    heroSection.appendChild(slideshowContainer);
    
    // Dots navigation
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => currentSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    heroSection.appendChild(dotsContainer);
    
    // Add FULL FRAME overlay
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    overlay.innerHTML = `
        <div class="hero-overlay-content">
            <h1 id="slideTitle">${slides[0].title}</h1>
            <p id="slideDesc">${slides[0].desc}</p>
        </div>
    `;
    heroSection.appendChild(overlay);
    
    let currentIndex = 0;
    const slideElements = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const titleElement = document.getElementById('slideTitle');
    const descElement = document.getElementById('slideDesc');
    
    // Function to change slide
    const showSlide = (index) => {
        slideElements.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slideElements[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update overlay text with fade effect
        if (titleElement && descElement) {
            titleElement.style.opacity = '0';
            descElement.style.opacity = '0';
            
            setTimeout(() => {
                titleElement.textContent = slides[index].title;
                descElement.textContent = slides[index].desc;
                titleElement.style.opacity = '1';
                descElement.style.opacity = '1';
            }, 300);
        }
        
        currentIndex = index;
    };
    
    const nextSlide = () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    };
    
    window.prevSlide = () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    };
    
    window.currentSlide = (index) => {
        showSlide(index);
        resetTimer();
    };
    
    let slideInterval = setInterval(nextSlide, 4000);
    const resetTimer = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    };
    
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
    initHeroSlider();
}

const displayProvinces = (provincesList) => {
    //using fragment to reload faster
    const fragment = document.createDocumentFragment();
    grid.innerHTML = "";

    // Update results counter
    if (resultsCount) {
        resultsCount.textContent = provincesList.length === provinces.length
            ? `Showing all ${provincesList.length} provinces`
            : `${provincesList.length} province${provincesList.length !== 1 ? "s" : ""} found`;
    }

    if (provincesList.length === 0) {
        grid.innerHTML = "<p>No provinces found.</p>";
        return;
    }

    // Load saved wishlist from browser
    const favs = JSON.parse(localStorage.getItem("sabaytrip_favs") || "[]");

    provincesList.forEach(province => {
        const card = document.createElement("div");
        card.className = "card";

        const tagHTML = province.tag ? `<span class="tag">${province.tag}</span>` : "";
        const imgSrc = province.img || "https://placehold.co/600x400/0B2D72/white?text=Cambodia";
        const isFav = favs.includes(province.name);

        card.innerHTML = `
            <div class="card-img">
                <img src="${imgSrc}" alt="${province.name}">
                ${tagHTML}
                <button class="heart-btn ${isFav ? "loved" : "not-loved"}" data-name="${province.name}" title="Add to wishlist">
                    ${isFav ? "♥" : "♡"}
                </button>
            </div>

            <div class="card-content">
                <h3>${province.name}</h3>

                <div class="card-rating">
                    ${province.rate || "★★★★☆"} <span class="provinceRate">${province.score || "4.5"}</span>
                </div>

                <p>${province.description || "Beautiful destination in Cambodia waiting to be explored."}</p>

                <a href="explore.html?province=${encodeURIComponent(province.name)}" class="plan-btn">
                    Plan Trip
                </a>
            </div>
        `;

        // Heart button toggle logic
        card.querySelector(".heart-btn").addEventListener("click", (e) => {
            e.preventDefault();
            const btn = e.currentTarget;
            const name = btn.dataset.name;
            const saved = JSON.parse(localStorage.getItem("sabaytrip_favs") || "[]");

            if (saved.includes(name)) {
                const updated = saved.filter(n => n !== name);
                localStorage.setItem("sabaytrip_favs", JSON.stringify(updated));
                btn.textContent = "♡";
                btn.classList.remove("loved");
                btn.classList.add("not-loved");
            } else {
                saved.push(name);
                localStorage.setItem("sabaytrip_favs", JSON.stringify(saved));
                btn.textContent = "♥";
                btn.classList.remove("not-loved");
                btn.classList.add("loved");
            }

            fragment.appendChild(card);
        });
        
        grid.appendChild(card);

    });
};

const applyFilters = () => {
    let filteredProvinces = provinces;
    
    if (searchText !== "") {
        filteredProvinces = filteredProvinces.filter(province => {
            return province.name.toLowerCase().includes(searchText.toLowerCase());
        });
    }
    
    if (currentFilter !== "all") {
        if (currentFilter === "popular") {
            filteredProvinces = filteredProvinces.filter(province => {
                return province.tag === "Most Popular";
            });
        }
        else if (currentFilter === "coastal") {
            filteredProvinces = filteredProvinces.filter(province => {
                const coastalList = ["Sihanoukville", "Kampot", "Kep", "Koh Kong"];
                return coastalList.includes(province.name);
            });
        }
        else if (currentFilter === "nature") {
            filteredProvinces = filteredProvinces.filter(province => {
                const natureList = ["Mondulkiri", "Ratanakiri", "Kratie", "Kampong Speu", "Stung Treng", "Pursat", "Pailin"];
                return natureList.includes(province.name);
            });
        }
        else if (currentFilter === "city") {
            filteredProvinces = filteredProvinces.filter(province => {
                const cityList = ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot", "Svay Rieng"];
                return cityList.includes(province.name);
            });
        }
    }
    displayProvinces(filteredProvinces);
};

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const searchValue = searchInput.value.trim();
    if (searchValue === "") {
        alert("Please enter a province name");
        return;
    }
    searchText = searchValue;
    applyFilters(); 
});

let timer;
searchInput.addEventListener("input", () => {
    clearTimeout(timer);

    if (searchInput.value.trim() !== "") {
        clearBtn.classList.add("visible");
    } else {
        clearBtn.classList.remove("visible");
    }

    timer = setTimeout(() => {
        searchText = searchInput.value.trim();
        applyFilters();
    }, 300);
});

clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchText = "";
    clearBtn.classList.remove("visible");
    applyFilters();
});

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        applyFilters();
    });
});

window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > 300;
    toTopBtn.classList.toggle("show", shouldShow);
});

toTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

loadProvinces();