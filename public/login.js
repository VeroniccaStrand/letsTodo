// login.js
import { login } from 'auth.js';

const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  login(email, password);
});
