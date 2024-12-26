const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector(".todo-form");
const submit = document.querySelector("#submit");
const todoInput = document.querySelector("#todo-input");

const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

function setLocalStorageTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

setLocalStorageTasks(tasks);

function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;

    return div.innerHTML;
}

submit.onmousedown = function (e) {
    e.preventDefault();
};

todoForm.onsubmit = function (e) {
    e.preventDefault();

    addTask(todoInput);
    renderTask();
    clearInput(todoInput);
};

function isDuplicateTask(title, taskIndex = -1) {
    return tasks.some(
        (task, index) =>
            task.title.toLowerCase() === title.toLowerCase() &&
            taskIndex !== index
    );
}

function addTask(e) {
    const title = e.value.trim();

    if (!title) return alert("Please write something!");

    if (isDuplicateTask(title)) return alert("The task already exists");

    const newTask = { title, completed: false };

    tasks.push(newTask);

    return setLocalStorageTasks(tasks);
}

function clearInput(e) {
    return (e.value = "");
}

taskList.onclick = function (e) {
    const taskItem = e.target.closest(".task-item");

    if (!taskItem) return;

    const taskIndex = +taskItem.getAttribute("data-index");

    if (e.target.closest(".edit")) editTask(taskIndex);
    else if (e.target.closest(".done")) markTask(taskIndex);
    else if (e.target.closest(".delete")) deleteTask(taskIndex);

    return renderTask();
};

function editTask(taskIndex) {
    const task = tasks[taskIndex];
    const newTitle = prompt("Edit task", task.title).trim();

    if (!newTitle.length) return alert("Task title cannot be empty!");

    if (isDuplicateTask(newTitle, taskIndex))
        return alert("The task already exists");

    task.title = newTitle ?? task.title;

    return setLocalStorageTasks(tasks);
}

function markTask(taskIndex) {
    const task = tasks[taskIndex];
    return (task.completed = !task.completed);
}

function deleteTask(taskIndex) {
    if (confirm(`Are you sure you want to delete ${tasks[taskIndex].title}`)) {
        tasks.splice(taskIndex, 1);

        return setLocalStorageTasks(tasks);
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
        }" data-index="${index}">
            <span class="task-title">${escapeHtml(task.title)}</span>
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

    const htmlClear = DOMPurify.sanitize(html);

    return (taskList.innerHTML = htmlClear);
}

renderTask();
