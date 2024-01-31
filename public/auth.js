async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Spara token
      localStorage.setItem('token', data.token);
      window.location.href = '/public/index.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function register(name, email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Logga in automatiskt efter registrering
      await login(email, password);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
}

// Exportera funktionerna för att de ska kunna användas av andra moduler
export { login, register };
