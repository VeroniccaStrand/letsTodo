// URL till servern
const serverUrl = 'http://localhost:3000';

// Funktion för att hämta todos från servern
// main.js

async function fetchTodos() {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${serverUrl}/api/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('An error occurred while fetching todos.');
  }
}

// Funktion för att rendera todos på sidan

function renderTodos(todos) {
  const todoList = document.querySelector('.todo-list');
  todoList.innerHTML = '';

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    console.log('Todo:', todo);
    const todoTitle = document.createElement('li');
    const todoInfo = document.createElement('span');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    todoTitle.classList.add('todo-title');
    todoTitle.dataset.id = todo.id; // Tilldela todo-id här
    todoTitle.innerText = todo.todo;
    deleteButton.innerText = 'X';
    if (todo.completed === 1) {
      todoTitle.appendChild(deleteButton);
      todoTitle.classList.add('completed');
      todoInfo.style.visibility = 'hidden';
    }
    console.log('Instructions:', todo.instruction);
    todoInfo.innerText = todo.instruction;
    todoList.append(todoTitle, todoInfo);
  }
}

// Funktion för att hämta todos och rendera dem när sidan laddas
const fetchAndRenderTodos = async () => {
  try {
    const todos = await fetchTodos();
    renderTodos(todos);
  } catch (error) {
    throw new Error('An error occurred while fetching todos.');
  }
};

document.addEventListener('DOMContentLoaded', fetchAndRenderTodos);

document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  clearErrorMessages();

  const titleInput = document.getElementById('inputTodo');
  const instructionsInput = document.getElementById('instructions');

  try {
    const token = localStorage.getItem('token');
    const title = titleInput.value.trim();
    const instructions = instructionsInput.value.trim();

    if (title === '' || instructions === '') {
      if (title === '') {
        displayErrorMessage(titleInput, 'Fyll i Todo');
      }
      if (instructions === '') {
        displayErrorMessage(instructionsInput, 'Fyll i instruktioner');
      }
      return;
    }

    const formData = {
      todo: title,
      instructions: instructions,
    };

    const response = await fetch(`${serverUrl}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log('New todo created:', newTodo);
      titleInput.value = '';
      instructionsInput.value = '';
      fetchAndRenderTodos();
    } else {
      console.error('Failed to create todo:', response.statusText);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});

// Funktion för att visa felmeddelanden under inputfält
function displayErrorMessage(inputElement, errorMessage) {
  const errorElement = document.createElement('p');
  errorElement.className = 'error-message';
  errorElement.innerText = errorMessage;
  inputElement.parentNode.appendChild(errorElement);
}

// Funktion för att rensa bort tidigare felmeddelanden
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((errorMessage) => errorMessage.remove());
}

document
  .querySelector('.todo-list')
  .addEventListener('click', async function (event) {
    const todoTitleElement = event.target.closest('.todo-title');

    if (todoTitleElement) {
      const todoId = todoTitleElement.dataset.id;

      try {
        const response = await fetch(`${serverUrl}/api/todos/${todoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed: 1,
            Authorization: `Bearer ${token}`, // Set completed to 1 to mark it as completed
          }),
        });

        if (response.ok) {
          const updatedTodo = await response.json();
          console.log('Todo marked as completed:', updatedTodo);

          // Update the frontend list after marking a todo as completed
          fetchAndRenderTodos();
        } else {
          console.error(
            'Failed to mark todo as completed:',
            response.statusText
          );
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
      todoTitleElement.classList.add('completed');
    }
  });

// Lägg till eventlistener för .delete-button
document
  .querySelector('.todo-list')
  .addEventListener('click', async function (event) {
    const deleteButtonElement = event.target.closest('.delete-button');

    if (deleteButtonElement) {
      const todoTitleElement = deleteButtonElement
        .closest('.todo-item')
        .querySelector('.todo-title');
      const todoId = todoTitleElement.dataset.id;
      console.log(todoId);
      try {
        // Anropa deleteTodo-funktionen med todo-id
        await deleteTodo(todoId);
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    }
  });
