let trips = (JSON.parse(localStorage.getItem("plans")) || [])
  
// Save to localStorage
const saveTrips = () => {
  // trips.push(newTrip);
  localStorage.setItem("plans", JSON.stringify(trips));
}

const displayTrips = () => {
  const list = document.getElementById("plannerList");
  list.innerHTML = "";

  list.style.display = "flex";
  list.style.flexWrap = "wrap";
  list.style.gap = "15px";

  const validTrips = trips.filter(trip => trip && trip.days);
  if (validTrips.length === 0) {
    list.innerHTML = "<p class='empty'>No trips added yet.</p>";
    return;
  }

  trips.forEach((trip, index) => {
    if (!trip || !trip.days) return;
    const daysHTML = trip.days.map((day, i) => `
      <div class="day-box">
        <h3><b>Day ${i + 1}</b></h3>
        <p><b>${day.date}</b></p>
        <p>${day.weather}</p>

        <textarea 
          id="note-${index}-${i}" 
          ${trip.editing ? "" : "disabled"}
        >${day.note || ""}</textarea>
      </div>
    `).join("");

    let dayCount = 1;
    list.innerHTML += `
      <div class="card">
        <div class="card-content">
          <h2><b>Trip ${index + 1}</b></h2>
          <h3>${trip.province || "Unknown Location"}</h3>

          <p>${trip.startDate} → ${trip.endDate}</p>

          ${daysHTML}

          <div class="btn-group">
            <button type="button" class="edit-btn" onclick="toggleEdit(${index})">
              ${trip.editing ? "Save" : "Edit"}
            </button>

            <button type="button" class="delete-btn" onclick="deleteTrip(${index})">
              Delete
            </button>
          </div>

        </div>
      </div>
    `;
  });
};

// Toggle edit
const toggleEdit = (index) => {
  const trip = trips[index];

  if (trip.editing) {
    trip.days.forEach((day, i) => {
      const textarea = document.getElementById(`note-${index}-${i}`);
      day.note = textarea.value;
    });

    trip.editing = false;
  } else {
    trip.editing = true;
  }

  saveTrips();
  displayTrips();
};

// Delete trip
const deleteTrip = (i) => {
  trips.splice(i, 1);

  saveTrips();
  displayTrips();
};


displayTrips();
