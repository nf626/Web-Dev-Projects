// Variables
const todoList = [];
const addTaskButton = document.querySelector("#addButton");

addTaskButton.addEventListener("click", addtoDo);

/**
 * Display and Updates page
 */
function renderTodoList() {
    let todoListHTML = "";

    // show created new tasks
    for (let i = 0; i < todoList.length; i++) {
        const todoObject = todoList[i];
        const {task, dueDate} = todoObject;
        const html = `
        <div class="taskList">${task}</div>
        <div class="dateList">${dueDate}</div>
        <button class="deleteButton" onclick="
            todoList.splice(${i}, 1);
            renderTodoList();
        ">Delete</button>
        `;
        todoListHTML += html;
    }

    // update display
    document.querySelector(".js-todo-list").innerHTML = todoListHTML;
}

/**
 * Adds task in list style
 */
function addtoDo() {
    // task input
    const inputElement = document.querySelector(".js-input");
    const task = inputElement.value.trim();
    // date input
    const dateInputElement = document.querySelector(".js-date-input");
    const dueDate = dateInputElement.value;
    
    // empty inputs
    if (!task || !dueDate) {
        inputElement.value = "";
        dateInputElement.value = "";
        alert("Please enter task and date");
    } else {
        todoList.push({
            task,
            dueDate
        }); // store object to array

        // reset inputs
        inputElement.value = "";
        dateInputElement.value = "";

        renderTodoList(); // update page
    }
}
