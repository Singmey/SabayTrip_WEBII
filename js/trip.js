let provinces = [];        
let currentFilter = "all"; 
let searchText = "";      

const grid = document.getElementById("provinceList");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const chips = document.querySelectorAll(".chip");
const toTopBtn = document.getElementById("toTopBtn");

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


const displayProvinces = (provincesList) => {
    grid.innerHTML = "";
    
    if (provincesList.length === 0) {
        grid.innerHTML = "<p>No provinces found.</p>";
        return;
    }
    
    provincesList.forEach(province => {
        const card = document.createElement("div");
        card.className = "card";
        
        const tagHTML = province.tag ? `<span class="tag">${province.tag}</span>` : "";
        
        card.innerHTML = `
            <div class="card-img">
                <img src="${province.img}" alt="${province.name}">
                ${tagHTML}
            </div>

            <div class="card-content">
                <h3>${province.name}</h3>

                <div class="card-rating">
                    ${province.rate} <span class="provinceRate">${province.score}</span>
                </div>

                <p>${province.description}</p>

                <a href="explore.html?province=${encodeURIComponent(province.name)}" class="plan-btn">
                    Plan Trip
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

//Filter province bar
const filterBySearch = (provinceList) => {
    if (searchText === "") return provinceList;
    
    return provinceList.filter((province) => 
        (province.name || "").toLowerCase().includes(searchText.toLowerCase())
    );
};

const filterByCategory = (provinceList) => {
    // Early return if no filter selected
    if (currentFilter === "all") return provinceList;
    
    // Apply category filter
    const filterMaps = {
        popular: (province) => province.tag === "Most Popular",
        coastal: (province) => ["Sihanoukville", "Kampot", "Kep", "Koh Kong"].includes(province.name),
        nature: (province) => ["Mondulkiri", "Ratanakiri", "Kratie", "Kampong Speu", "Stung Treng", "Pursat", "Pailin"].includes(province.name),
        city: (province) => ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot", "Svay Rieng"].includes(province.name)
    };
    
    const filterFn = filterMaps[currentFilter] || (() => true);
    return provinceList.filter(filterFn);
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

// Real-time search as user types
searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.trim();
    searchText = searchValue;
    applyFilters(); 
});

// Category chips click handlers
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

loadProvinces();