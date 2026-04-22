const placeList = document.getElementById("placeList");
const title = document.getElementById("provinceTitle");

// Get province from URL
const params = new URLSearchParams(window.location.search);
const selectedProvince = params.get("province");

// Display province name in title
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

const fetchPlaces = async () => {
    try {
        // Fetch the JSON file
        const response = await fetch('data/places.json');
        
        // Convert response to JSON
        const data = await response.json();
        
        // Filter places by selected province
        const provincePlaces = data.places.filter(place => {
            return place.provinceName === selectedProvince;
        });
        
        // Display the places
        displayPlaces(provincePlaces);
        
    } catch (error) {
        // Show error message if something goes wrong
        console.error("Error loading places:", error);
        placeList.innerHTML = "<p>Failed to load places. Please try again later.</p>";
    }
};

// Display places
const displayPlaces = (places) => {
  placeList.innerHTML = "";

  if (places === 0) {
    placeList.innerHTML = "<p>No places found.</p>";
    return;
  }

  places.forEach(place => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <div class="card-img">
            <img src="${place.img}" alt="${place.name}">
        </div>

        <div class="card-content">
            <h3>${place.name}</h3>
            <p>${place.desc}</p>
        </div>
    `;
    card.addEventListener("click", () => {
        showResult(selectedProvince);
    });

    placeList.appendChild(card);
  });
};

let startDate = null;
let endDate = null;

const renderDays = () => {
  const container = document.getElementById("daySelector");
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

  textareas.forEach(textarea => {
    days.push({
      date: textarea.dataset.date,
      note: textarea.value,
      weather: `${textarea.dataset.temp}°C ${textarea.dataset.condition}`
    });
  });

  const trip = {
    province: selectedProvince,
    startDate,
    endDate,
    days
  };

  plans.push(trip);

  localStorage.setItem("plans", JSON.stringify(plans));

  alert("Trip saved successfully!");
  textareas.forEach(textarea => textarea.value = "");
};

const showResult = async(selectedProvince) => {
  const city = cityMap[selectedProvince] || selectedProvince;

  const container = document.getElementById("weatherContainer");
  container.innerHTML = "<p>Loading weather...</p>";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7620caa109fc8899c1ddb2f001cf6e10&units=metric`
    );

    //check if API failed
    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await res.json();

    //check if API returns empty or wrong city
    if (!data.list) {
      throw new Error("Invalid data received");
    }

    container.innerHTML = "";

    let current = new Date(startDate);

    while (current <= new Date(endDate)) {
      const dateStr = current.toISOString().split("T")[0];

      const weather = data.list.find(item =>
        item.dt_txt.includes(dateStr + " 12:00:00")
      );

      const temp = weather ? weather.main.temp : "N/A";
      const condition = weather ? weather.weather[0].main : "No data";

      const div = document.createElement("div");

      div.innerHTML = `
        <h4>${dateStr}</h4>
        <p>${temp}°C - ${condition}</p>

        <textarea 
          placeholder="Write note..." 
          data-date="${dateStr}"
          data-temp="${temp}"
          data-condition="${condition}"
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

    btn.addEventListener("click",() => savePlan());

    document.getElementById("btn-save").appendChild(btn);

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.padding = "10px 20px";
    cancelBtn.addEventListener("click", () => {
    startDate = null;
    endDate = null;

    document.getElementById("weatherContainer").innerHTML = "";
    document.getElementById("btn-save").innerHTML = "";

    const dayContainer = document.getElementById("daySelector");
    dayContainer.innerHTML = "";

    renderDays(); // recreate fresh buttons
    });

    btnContainer.appendChild(cancelBtn);

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p class='error'>Weather unavailable. You can still write notes below.</p>";

    // Still render the days with empty weather
    let current = new Date(startDate);
    while (current <= new Date(endDate)) {
      const dateStr = current.toISOString().split("T")[0];

      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${dateStr}</h4>
        <p>N/A - No weather data</p>
        <textarea 
          placeholder="Write note..." 
          data-date="${dateStr}"
          data-temp="N/A"
          data-condition="No data"
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

    btn.addEventListener("click",() => savePlan());

    document.getElementById("btn-save").appendChild(btn);

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.padding = "10px 20px";
    cancelBtn.addEventListener("click", () => {
    startDate = null;
    endDate = null;

    document.getElementById("weatherContainer").innerHTML = "";
    document.getElementById("btn-save").innerHTML = "";

    const dayContainer = document.getElementById("daySelector");
    dayContainer.innerHTML = "";

    renderDays(); // recreate fresh buttons
    });

    btnContainer.appendChild(cancelBtn);
  }
}

renderDays();
fetchPlaces();