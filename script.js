const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
let todoArray = [];
let editIndex = -1;

const addtodolocal = (array) => {
    localStorage.setItem('todo', JSON.stringify(array));
    displayTodoItems(array);
};

const createTodoElement = (value, completed = false) => {
    const li = document.createElement("li");
    li.className = completed ? 'task-completed' : ''; // Set the class based on completion status
    li.innerHTML = `
        <span class="task">${value}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="complete-btn">${completed ? 'Not Completed' : 'Complete'}</button>`;
    list.appendChild(li);
};

const repFunc = (value) => {
    if (value.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    const existingIndex = todoArray.findIndex(item => item.value === value);

    if (existingIndex === -1) {
        if (editIndex !== -1) {
            // If editing, replace the old value with the new one
            todoArray[editIndex].value = value;
            editIndex = -1; // Reset the edit index
        } else {
            // If not editing, add the new value
            createTodoElement(value);
            todoArray.push({ value, completed: false });
        }

        addtodolocal(todoArray);
    } else {
        alert("This task already exists!");
    }

    input.value = ''; // Clear the input after adding or editing
};

const showtodo = () => {
    const storedData = localStorage.getItem('todo');
    if (storedData) {
        todoArray = JSON.parse(storedData);
        displayTodoItems(todoArray);
    }
};

const displayTodoItems = (array) => {
    list.innerHTML = ''; // Clear the existing list
    array.forEach((item) => createTodoElement(item.value, item.completed));
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    repFunc(input.value);
});

list.addEventListener('click', (e) => {
    const targetClassList = e.target.classList;
    const parentElement = e.target.parentElement;

    if (targetClassList.contains('delete-btn')) {
        const existValue = parentElement.querySelector('.task').innerText;
        todoArray = todoArray.filter(item => item.value !== existValue);
        addtodolocal(todoArray);
        parentElement.remove();
    } else if (targetClassList.contains('edit-btn')) {
        const existValue = parentElement.querySelector('.task').innerText;

        // Remove the line-through effect when clicking the Edit button
        parentElement.classList.remove("task-completed");

        // Set the editIndex to the index of the task being edited
        editIndex = todoArray.findIndex(item => item.value === existValue);

        if (editIndex !== -1) {
            // If editing, remove the existing task from the DOM
            parentElement.remove();
        }

        // Set the input value to the task being edited
        input.value = existValue;
    } else if (targetClassList.contains('complete-btn')) {
        const taskElement = parentElement.querySelector('.task');
        const existValue = taskElement.innerText;

        // Toggle the 'task-completed' class on the task element
        taskElement.classList.toggle("task-completed");

        // Toggle the completion status in the todoArray
        const taskIndex = todoArray.findIndex(item => item.value === existValue);

        if (taskIndex !== -1) {
            todoArray[taskIndex].completed = !todoArray[taskIndex].completed;

            // Update the displayed list
            addtodolocal(todoArray);
        }
    }
});

input.addEventListener("input", (e) => {
    const storedData = localStorage.getItem('todo');
    if (storedData) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = todoArray.filter(item => item.value.toLowerCase().includes(searchTerm));
        displayTodoItems(searchTerm ? filteredItems : todoArray);
    }
});

// Initial display of all todo items
showtodo();
