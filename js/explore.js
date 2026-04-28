const placeList = document.getElementById("placeList");
const title = document.getElementById("provinceTitle");

const params = new URLSearchParams(window.location.search);
const selectedProvince = params.get("province");

title.textContent = selectedProvince;
const cityMap = {
    "Phnom Penh City": "Phnom Penh",
    "Siem Reap": "Siem Reap",
    "Battambang": "Battambang",
    "Sihanoukville": "Sihanoukville",
    "Kampot": "Kampot",
    "Kep": "Kep",
    "Kratie": "Kratie",
    "Kampong Cham": "Kampong Cham",
    "Kampong Chnang": "Kampong Chhnang",
    "Kampong Speu": "Kampong Speu",
    "Kampong Thom": "Kampong Thom",
    "Kandal": "Ta Khmau",
    "Mondulkiri": "Sen Monorom",
    "Ratanakiri": "Banlung",
    "Pursat": "Pursat",
    "Stung Treng": "Stung Treng",
    "Takeo": "Takeo",
};


let savedPlaces = [];
const updateSavedBadge = () => {
    const badge = document.getElementById("savedCount");
    if (!badge) return;
    if (savedPlaces.length > 0) {
        badge.textContent = `♥ ${savedPlaces.length} saved`;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
};

const fetchPlaces = async () => {
    try {
        const response = await fetch('data/places.json');
        const data = await response.json();
        const provincePlaces = data.places.filter(place => place.provinceName === selectedProvince);
        displayPlaces(provincePlaces);
    } catch (error) {
        console.error("Error loading places:", error);
        placeList.innerHTML = "<p style='padding:20px;color:#aaa;'>Failed to load places. Please try again.</p>";
    }
};

const displayPlaces = (places) => {
    placeList.innerHTML = "";

    const countBadge = document.getElementById("placeCount");
    if (countBadge) countBadge.textContent = `${places.length} places`;

    if (places.length === 0) {
        placeList.innerHTML = "<p style='padding:20px;color:#aaa;'>No places found for this province.</p>";
        return;
    }

    places.forEach(place => {
        const card = document.createElement("div");
        card.className = "card";

        const isSaved = savedPlaces.includes(place.name);
        if (isSaved) card.classList.add("saved");

        card.innerHTML = `
            <div class="card-img">
                <img src="${place.img}" alt="${place.name}">
            </div>
            <div class="card-content">
                <div>
                    <h3>${place.name}</h3>
                    <p>${place.desc}</p>
                </div>
                <button class="save-place-btn ${isSaved ? 'saved' : ''}">
                    ${isSaved ? '♥ Saved' : '♡ Save place'}
                </button>
            </div>
        `;

        card.querySelector(".save-place-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            if (savedPlaces.includes(place.name)) {
                savedPlaces = savedPlaces.filter(n => n !== place.name);
                btn.textContent = "♡ Save place";
                btn.classList.remove("saved");
                card.classList.remove("saved");
            } else {
                savedPlaces.push(place.name);
                btn.textContent = "♥ Saved";
                btn.classList.add("saved");
                card.classList.add("saved");
            }
            updateSavedBadge();
        });

        card.addEventListener("click", () => {
            if (startDate && endDate) showResult(selectedProvince);
        });

        placeList.appendChild(card);
    });
};

let startDate = null;
let endDate = null;

const renderDays = () => {
    const container = document.getElementById("daySelector");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];

        const btn = document.createElement("button");
        btn.innerText = dateStr;
        btn.onclick = () => selectDate(dateStr, btn);
        container.appendChild(btn);
    }
};

const selectDate = (date, element) => {
    if (!startDate) {
        startDate = date;
        element.classList.add("start");
    } 
    else if (!endDate) {
        endDate = date;

        if (new Date(endDate) < new Date(startDate)) {
            [startDate, endDate] = [endDate, startDate];
        }

        highlightRange();
        showResult(selectedProvince);
    }
    else {
        startDate = date;
        endDate = null;

        document.querySelectorAll("#daySelector button")
            .forEach(btn => btn.classList.remove("start", "end", "in-range"));

        element.classList.add("start");
    }
};

const highlightRange = () => {
    const buttons = document.querySelectorAll("#daySelector button");

    buttons.forEach(btn => {
        const date = btn.innerText;
        btn.classList.remove("start", "end", "in-range");
        if (date === startDate) btn.classList.add("start");
        else if (date === endDate) btn.classList.add("end");
        else if (date > startDate && date < endDate) {
            btn.classList.add("in-range");
        }
    });
};

const savePlan = () => {
    let plans = JSON.parse(localStorage.getItem("plans")) || [];

    const textareas = document.querySelectorAll("#weatherContainer textarea");
    let days = [];

    textareas.forEach((textarea, i) => {
        days.push({
            dayNumber: i + 1,
            date: textarea.dataset.date,
            note: textarea.value,
            weather: `${textarea.dataset.temp}°C ${textarea.dataset.condition}`
        });
    });

    const trip = {
        province: selectedProvince,
        startDate,
        endDate,
        dayCount: days.length,
        savedPlaces: [...savedPlaces],
        days
    };

    plans.push(trip);
    localStorage.setItem("plans", JSON.stringify(plans));

    startDate = null;
    endDate = null;

    document.getElementById("weatherContainer").innerHTML = "";
    document.getElementById("btn-save").innerHTML = "";

     const rangeText = document.getElementById("rangeText");
    if (rangeText) rangeText.style.display = "none";
    const resetDatesBtn = document.getElementById("resetDatesBtn");
    if (resetDatesBtn) resetDatesBtn.style.display = "none";

    renderDays();
    document.querySelectorAll("#daySelector button")
        .forEach(btn => btn.classList.remove("start", "end", "in-range"));

    const container = document.getElementById("weatherContainer");
    container.innerHTML = "<p style='padding:16px;color:green; text-align:center'>Trip saved successfully!</p>";
    setTimeout(() => container.innerHTML = "", 2000);
};

const showResult = async (province) => {
    const city = cityMap[province] || province;
    const container = document.getElementById("weatherContainer");
    container.innerHTML = "<p>Loading weather...</p>";

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7620caa109fc8899c1ddb2f001cf6e10&units=metric`
        );

        if (!res.ok) throw new Error("Failed to fetch weather data");
        const data = await res.json();
        if (!data.list) throw new Error("Invalid data received");

        container.innerHTML = "";

        let current = new Date(startDate);
        let dayCount = 1;

        while (current <= new Date(endDate)) {
            const dateStr = current.toISOString().split("T")[0];
            const weather = data.list.find(item => item.dt_txt.includes(dateStr + " 12:00:00"));
            const temp = weather ? weather.main.temp : "N/A";
            const condition = weather ? weather.weather[0].main : "No data";

            const div = document.createElement("div");
            div.className = "weather-day-card";
            div.innerHTML = `
                <h3>Day ${dayCount}</h3>
                <h4>${dateStr}</h4>
                <p>${temp}°C - ${condition}</p>
                <textarea 
                    placeholder="Write note..." 
                    data-date="${dateStr}"
                    data-temp="${temp}"
                    data-condition="${condition}"
                    rows="2"
                ></textarea>
            `;
            container.appendChild(div);
            current.setDate(current.getDate() + 1);
            dayCount++;
        }

        const btnContainer = document.getElementById("btn-save");
        btnContainer.innerHTML = "";
        const btn = document.createElement("button");
        btn.textContent = "Save Trip";
        btn.id = "myBtn";
        btn.style.padding = "10px 20px";
        btn.addEventListener("click", () => savePlan());
        btnContainer.appendChild(btn);

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.id = "cancel-btn";
        cancelBtn.addEventListener("click", () => {
        startDate = null;
        endDate = null;
        document.getElementById("weatherContainer").innerHTML = "";
        document.getElementById("btn-save").innerHTML = "";
        const dayContainer = document.getElementById("daySelector");
        dayContainer.innerHTML = "";
        renderDays();
        });
        btnContainer.appendChild(cancelBtn);

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p class='error'>Weather unavailable. You can still write notes below.</p>";

        let current = new Date(startDate);
        while (current <= new Date(endDate)) {
            const dateStr = current.toISOString().split("T")[0];
            const div = document.createElement("div");
            div.className = "weather-day-card";
            div.innerHTML = `
                <h4>${dateStr}</h4>
                <p>N/A - No weather data</p>
                <textarea 
                    placeholder="Write note..." 
                    data-date="${dateStr}"
                    data-temp="N/A"
                    data-condition="No data"
                    rows="2"
                ></textarea>
            `;
            container.appendChild(div);
            current.setDate(current.getDate() + 1);
        }

        // Save button
        const btnContainer = document.getElementById("btn-save");
        btnContainer.innerHTML = "";
        const btn = document.createElement("button");
        btn.textContent = "Save Trip";
        btn.id = "myBtn";
        btn.style.padding = "10px 20px";
        btn.addEventListener("click", () => savePlan());
        btnContainer.appendChild(btn);

        // Cancel button
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.id = "cancel-btn"
        cancelBtn.style.padding = "10px 20px";
        cancelBtn.addEventListener("click", () => {
        startDate = null;
        endDate = null;
        document.getElementById("weatherContainer").innerHTML = "";
        document.getElementById("btn-save").innerHTML = "";
        const dayContainer = document.getElementById("daySelector");
        dayContainer.innerHTML = "";
        renderDays();
        });
        btnContainer.appendChild(cancelBtn);
    }
};

const resetBtn = document.getElementById("resetDatesBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        startDate = null;
        endDate = null;
        document.getElementById("weatherContainer").innerHTML = "";
        document.getElementById("btn-save").innerHTML = "";
        document.getElementById("rangeText").style.display = "none";
        resetBtn.style.display = "none";
        renderDays();

        document.querySelectorAll("#daySelector button")
            .forEach(btn => btn.classList.remove("start", "end", "in-range"));
    });
}

renderDays();
fetchPlaces();