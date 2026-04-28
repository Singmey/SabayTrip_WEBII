const switchAuthTab = (tab) => {
  const login = document.getElementById('af-login');
  const signup = document.getElementById('af-signup');
  const tabs = document.querySelectorAll('.auth-tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    login.style.display = 'block';
    signup.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    login.style.display = 'none';
    signup.style.display = 'block';
    tabs[1].classList.add('active');
  }
}

// LOGIN
const login = () => {
  const email = document.querySelector('#af-login input[type="email"]').value.trim();
  const password = document.querySelector('#af-login input[type="password"]').value;

  const users = JSON.parse(localStorage.getItem('st_users') || '[]');

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert('Incorrect email or password');
    return;
  }

  localStorage.setItem('st_current_user', JSON.stringify(user));
  window.location.href = 'account.html';
}

// SIGNUP
const signup = () => {
  const inputs = document.querySelectorAll('#af-signup input');
  const firstName = inputs[0].value.trim();
  const lastName = inputs[1].value.trim();
  const email = inputs[2].value.trim();
  const password = inputs[3].value;

  if (!firstName || !lastName || !email || !password) {
    alert('Fill all fields');
    return;
  }

  const users = JSON.parse(localStorage.getItem('st_users') || '[]');

  if (users.find(u => u.email === email)) {
    alert('Email already exists');
    return;
  }

  const newUser = {
    name: firstName + ' ' + lastName,
    email,
    password
  };

  users.push(newUser);

  localStorage.setItem('st_users', JSON.stringify(users));
  localStorage.setItem('st_current_user', JSON.stringify(newUser));

  window.location.href = 'account.html';
}