const form = document.querySelector('#login');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);

  fetch('http://localhost:3333/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => res.json())
    .then((data) => localStorage.setItem('token', data.token))
    .catch((err) => console.log(err));
});

const signUp = document.querySelector('#sign-up');

signUp.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(signUp);
  const data = Object.fromEntries(formData);
  const body = JSON.stringify(data);

  fetch('http://localhost:3333/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});

const button = document.querySelector('#data');

button.addEventListener('click', () => {
  console.log('click');
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:3333/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});
