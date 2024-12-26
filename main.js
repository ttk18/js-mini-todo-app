const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector(".todo-form");
const submit = document.querySelector("#submit");
const todoInput = document.querySelector("#todo-input");

const tasks = [
    {
        title: "Javascript",
        completed: true,
    },
    {
        title: "React",
        completed: false,
    },
    {
        title: "Node",
        completed: false,
    },
];

submit.onmousedown = function (e) {
    e.preventDefault();
};

todoForm.onsubmit = function (e) {
    e.preventDefault();

    addTask(todoInput);
    renderTask();
    clearInput(todoInput);
};

function addTask(e) {
    const title = e.value.trim();

    if (!title) return alert("Please write something!");

    const newTask = { title, completed: false };

    return tasks.push(newTask);
}

function clearInput(e) {
    return (e.value = "");
}

taskList.onclick = function (e) {
    const taskItem = e.target.closest(".task-item");
    const taskIndex = +taskItem.getAttribute("task-index");

    if (e.target.closest(".edit")) editTask(taskIndex);
    else if (e.target.closest(".done")) markTask(taskIndex);
    else if (e.target.closest(".delete")) deleteTask(taskIndex);

    return renderTask();
};

function editTask(taskIndex) {
    const task = tasks[taskIndex];
    const newTitle = prompt("Edit task", task.title).trim();

    if (!newTitle.length) return alert("Task title cannot be empty!");

    return (task.title = newTitle ?? task.title);
}

function markTask(taskIndex) {
    const task = tasks[taskIndex];
    return (task.completed = !task.completed);
}

function deleteTask(taskIndex) {
    if (confirm(`Are you sure you want to delete ${tasks[taskIndex].title}`)) {
        return tasks.splice(taskIndex, 1);
    }
}

function renderTask() {
    if (!tasks.length) {
        return (taskList.innerHTML =
            '<li class="emply-task">No tasks available.</li>');
    }
    const html = tasks
        .map(
            (task, index) => `
        <li class="task-item ${
            task.completed ? "completed" : ""
        }" task-index="${index}">
            <span class="task-title">${task.title}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${
                    task.completed ? "Mark as undone" : "Mark as done"
                }</button>
                <button class="task-btn delete">Delete</button>
            </div>
        </li>
        `
        )
        .join("");

    return (taskList.innerHTML = html);
}

renderTask();
