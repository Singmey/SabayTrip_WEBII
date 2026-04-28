(() => {
  const user = JSON.parse(localStorage.getItem('st_current_user') || 'null');

  if (!user) {
    window.location.href = 'signInUp.html';
    return;
  }

  // Fill data
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  document.querySelector('.avatar').textContent = initials;
  document.querySelector('.card-top h2').textContent = user.name;
  document.querySelector('.card-top p').textContent = user.email;
})();

// LOGOUT
const logout = () => {
  localStorage.removeItem('st_current_user');
  window.location.href = 'signInUp.html';
}

const loadTripCount = () => {
  let trips = JSON.parse(localStorage.getItem("plans")) || [];
  const validTrips = trips.filter(trip => trip && trip.days);
  document.getElementById("tripCount").textContent = validTrips.length;
}

loadTripCount();