const form = document.querySelector("form")
const navTop = document.querySelector(".navTop")
const navLeft = document.querySelector(".navLeft")
const todoForm = document.querySelector("#todoForm")
const submit = document.querySelector("#submit")


function toastSave() {
    let x = document.getElementById("toastifySubmit");
    console.log()
    x.classList.add("show");
    setTimeout(function () {
        x.classList.remove("show")
    }, 3000);
}
function toastEdit() {
    let x = document.getElementById("toastifyEdit");
    console.log(x.classList)
    x.classList.add("show");
    console.log(x.className)
    setTimeout(function () {
        x.classList.remove("show")
    }, 3000);
}
function toastError(error) {
    let x = document.getElementById("toastifyError");
    let p = document.getElementById("error")
    p.textContent = error,
    console.log(x.classList)
    x.classList.add("show");
    console.log(x.className)
    setTimeout(function () {
        x.classList.remove("show")
    }, 3000);
}

function counter() {
    const span = document.querySelector(".navLeft .todoList span")
    let val = +span.innerHTML
    val++
    span.innerHTML = `${val}`;
}

async function getData() {
    const data = await fetch("https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos")
    return await data.json()
}

getData().then(res => document.querySelector(".navLeft .todoList span").innerHTML = `${res.length}`)
/***********************************************************************************************/
/*                                      fill the form                                          */
/***********************************************************************************************/
async function checkId() {
    const paramsEdit = new URLSearchParams(window.location.search);
    const id = paramsEdit.get("id")
    console.log(id)
    if (id) {
        let response = await fetch(`https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${id}`);
        if (response.ok) {
            let data = await response.json();
            console.log(data)
            for (const [key, value] of Object.entries(data)) {
                console.log(key, value)
                if (key === "title" || key === "description" || key === "dueDate") {
                    document.getElementById(`${key}`).value = value
                }
            }
            const submitBtn =document.getElementById("submit")
            submitBtn.textContent="Save";
            todoForm.addEventListener("submit", function (ev) {
                ev.preventDefault()
                const formData = new FormData(todoForm);
                const body = Object.fromEntries(formData);
                const date = new Date()
                body.createdAt = data.createdAt;
                body.updatedAt = `${date.toISOString()}`;
                body.checked = data.checked;
                fetch(`https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }).then(res => {
                    console.log(res.status)
                    if (res.status == 200 ) {
                        paramsEdit.delete("id");
                        history.replaceState(null, null, "home.html" + paramsEdit.toString());
                        toastEdit()
                        setTimeout(()=>location.assign(window.location.search),1500);
                    }
                }).catch(error => toastError(error.message)).finally()
            })

        } else {
            console.log("We Have an Error");
            let queries = new URLSearchParams(window.location.search);
            queries.delete("id");
            history.replaceState(null, null, "error.html?" + queries.toString());
            location.assign(window.location.search);
        }
    }
}

checkId()


/***********************************************************************************************/
/*                                      input validation                                       */
/***********************************************************************************************/
form.addEventListener("input", (ev) => {
    if (ev.target.tagName !== "INPUT") return
    document.querySelectorAll("input:invalid").forEach(item => {
        if (item === ev.target) {
            item.style.border = "1px solid #eb363d ";
            item.style.outline = "1px solid #eb363d ";
            item.previousElementSibling.style.color = "#eb363d";
            item.nextElementSibling.style.display = "block";
        }
    })
    document.querySelectorAll("input:valid").forEach(item => {
        item.style.border = "1px solid #5dc5a4 "
        item.style.outline = "1px solid #5dc5a4 "
        item.previousElementSibling.style.color = "black";
        item.nextElementSibling.style.display = "none";

    })
})
/***********************************************************************************************/
/*                                      to do list listener                                    */
/***********************************************************************************************/
// navTop.addEventListener("click", function (ev) {
//     if (ev.target.id === "home") {
//         ev.target.parentElement.classList.add("selected")
//         ev.target.parentElement.nextElementSibling.classList.remove("selected")
//
//     }
//     if (ev.target.id === "todoList") {
//         ev.target.parentElement.classList.add("selected")
//         ev.target.parentElement.previousElementSibling.classList.remove("selected")
//     }
// })
/***********************************************************************************************/
/*                                      submit Data                                            */
/***********************************************************************************************/
const paramsEdit = new URLSearchParams(window.location.search);
const id = paramsEdit.get("id")
if (!id) {
    todoForm.addEventListener("submit", function (ev) {
        ev.preventDefault()
        const formData = new FormData(todoForm);
        const body = Object.fromEntries(formData);
        const date = new Date()
        body.createdAt = `${date.toISOString()}`;
        body.updatedAt = `${date.toISOString()}`
        body.checked = false;
        fetch("https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res => {
            if (res.status == 201) {
                toastSave()
                todoForm.reset()
                counter()
            }
        }).catch(error => toastError(error.message)).finally()
    })
}