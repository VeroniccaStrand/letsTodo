import { register } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('register-btn');
  registerBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    register(name, email, password);
  });
});
