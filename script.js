const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";


// SAVE TO LOCAL STORAGE
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}


// RENDER TODOS
function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos.filter(todo => {
    if (currentFilter === "active") {
      return !todo.completed;
    }

    if (currentFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  filteredTodos.forEach(todo => {

    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;

    li.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span class="${todo.completed ? "completed" : ""}">
          ${todo.text}
        </span>
      </div>

      <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    todoList.appendChild(li);
  });

  saveTodos();
}


// ADD TODO
function addTodo() {

  const text = todoInput.value.trim();

  if (text === "") {
    alert("Task cannot be empty");
    return;
  }

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);

  todoInput.value = "";

  renderTodos();
}


// DELETE TODO
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}


// TOGGLE COMPLETE
function toggleTodo(id) {

  todos = todos.map(todo => {

    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed
      };
    }

    return todo;
  });

  renderTodos();
}


// EDIT TODO
function editTodo(id) {

  const todo = todos.find(todo => todo.id === id);

  const updatedText = prompt("Edit task:", todo.text);

  if (updatedText === null) return;

  todo.text = updatedText.trim();

  renderTodos();
}


// ADD BUTTON EVENT
addBtn.addEventListener("click", addTodo);


// ENTER KEY EVENT
todoInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    addTodo();
  }
});


// EVENT DELEGATION
todoList.addEventListener("click", (e) => {

  const li = e.target.closest(".todo-item");

  if (!li) return;

  const id = Number(li.dataset.id);

  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {
    editTodo(id);
  }

  // TOGGLE
  if (e.target.type === "checkbox") {
    toggleTodo(id);
  }
});


// FILTERING
filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTodos();
  });
});


// INITIAL RENDER
renderTodos();
