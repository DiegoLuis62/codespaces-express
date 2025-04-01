const inputbox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");

const API_URL = "https://localhost:3000/tasks";

async function loadTasks() {
    const res = await fetch("http://localhost:3000/tasks");
    const tasks = await res.json();

    listcontainer.innerHTML = "";

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerText = task.text;
        li.setAttribute("data-id", task.id);
        if (task.completed) li.classList.add("checked");

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        listcontainer.appendChild(li);
    });
}

loadTasks();

async function addtask() {
    if (inputbox.value === "") {
        alert("Debes escribir algo");
        return;
    }

    const text = inputbox.value;

    // Llamar al backend para guardar la tarea
    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const newTask = await response.json();

    let li = document.createElement("li");
    li.innerText = newTask.text;
    li.setAttribute("data-id", newTask.id); // para referencia futura

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    listcontainer.appendChild(li);

    inputbox.value = "";
}

listcontainer.addEventListener("click", async function (e) {
    const li = e.target.closest("li");
    const id = li?.getAttribute("data-id");

    if (e.target.tagName === "LI") {
        const completed = !li.classList.contains("checked") ? 1 : 0;
        li.classList.toggle("checked");

        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed })
        });
    } else if (e.target.tagName === "SPAN") {
        li.remove();
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE"
        });
    }
});

// function savedata(){
//     localStorage.setItem("data", listcontainer.innerHTML);
// }

// function showtask(){

//     listcontainer.innerHTML= localStorage.getItem("data");
// }

// showtask();