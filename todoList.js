let data;
const pageSize = 10;
let currentPage = 1;

async function load(id = 1) {
    data = await getData()
    console.log(data)
    makePageNumber()
    currentPage === id && document.getElementById(id).classList.add("badge--active")
    let param = new URLSearchParams(window.location.search)
    param.set("page", `${currentPage}`)
    history.pushState(null, null, "?" + param.toString());
    console.log(window.location.href)
    console.log(history)
    // location.assign(window.location.search)
    // let sorted = data.sort((a,b) => +b.dueDate.split("-").join("") - +a.dueDate.split("-").join(""))
    // console.log(sorted)
    let paginateData = paginate(data, currentPage, pageSize)
    paginateData=paginateData.reverse()
    console.log(paginateData)
    paginateData.forEach(item => {
        document.querySelector(".todos").insertAdjacentHTML("afterbegin", `<div class="box">
            <div class="head">
                <div class="left">
                    <p class="checked">
                        ${!item.checked ? `<i class="bi bi-circle" onclick="checked(${item.id})"></i>` : `<i class="bi bi-check2-circle" onclick="checked(${item.id})"></i>`}
                    </p>
                    <p class="title">
                        ${item.title}
                    </p>
                    <p class="date">
                        ${item.dueDate}
                    </p>
                </div>
                <div class="right">
                    <p><i class="bi bi-pencil" onclick="editData(${item.id})"></i></p>
                    <p><i class="bi bi-trash" onclick="deleteTodo(${item.id})"></i></p>
                </div>
            </div>

            <div class="description">
                <p class="descriptionText">
                    ${item.description}
                </p>
            </div>

        </div>`)
    })
    document.querySelector(".navLeft .todoList span").innerHTML = `${data.length}`

}

function checked(id) {
    console.log(id)
    let findRealtedData = data.find(item => item.id == id);
    findRealtedData.checked = !findRealtedData.checked;
    fetch(`https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(findRealtedData)
    }).then(() => {
        document.querySelector(".todos").innerHTML = "";
        load()
    })

}

function deleteTodo(id) {
    const find = data.find(item => item.id == id)
    document.body.insertAdjacentHTML("afterbegin", `<div id="myModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <span class="close">&times;</span>
            <h2>DELETE!</h2>
        </div>
        <div class="modal-body">
           <p>
           <span>Title: ${find.title}</span>
            <span>${find.dueDate}</span>
            </p>
            <p>Descrption: ${find.description}</p>
        </div>
        <div class="modal-footer">
            <h3>OK</h3>
        </div>
    </div>
</div> `)
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
        modal.style.display = "none";
    }
    const buttonOK = document.querySelector(".modal-footer h3")
    buttonOK.addEventListener("click", function () {
        fetch(`https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${id}`, {
            method: "DELETE"
        }).then(() => {
            modal.style.display = "none";
            document.querySelector(".todos").innerHTML = "";
            const param = new URLSearchParams(window.location.search)
            load(param.get("page"))
        });

    })
}

function editData(id) {
    let param = new URLSearchParams(window.location.search);
    param.delete("page");
    param.set("id", `${id}`);
    console.log(window.location.href)
    history.replaceState(null, null, "home.html?" + param.toString());
    console.log(window.location.href)
    location.assign(window.location.href);
}

load()

async function getData() {
    const data = await fetch("https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos")
    return await data.json()
}

async function getPaginateData(page = 1) {
    const data = await fetch(`https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos?page=${page}&limit=2&sortBy=dueDate&order=desc`)
    return await data.json()
}


getData().then(res => document.querySelector(".navLeft .todoList span").innerHTML = `${res.length}`)


/***********************************************************************************************/
/*                                      pagination                                             */

/***********************************************************************************************/

function paginate(items, pageNumber, pageSize = 10) {
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items)
        .slice(startIndex)
        .take(pageSize)
        .value();
}

function makePageNumber() {
    const countOfFilterItems = data.length;
    const pagesCount = Math.ceil(countOfFilterItems / pageSize);
    if (pagesCount >= 1) {
        document.querySelector(".page").querySelectorAll(".badge--small").forEach(item => item.remove())
        for (let i = 1; i <= pagesCount; i++) {
            const mySpan = document.createElement("span")
            mySpan.id = i;
            mySpan.className = "badge badge--small";
            mySpan.innerHTML = i;
            document.querySelector(".page").append(mySpan)
        }
    }
    document.querySelectorAll(".badge--small").forEach(item => item.addEventListener("click", function (ev) {
        document.querySelectorAll(".badge--small").forEach(item => item.classList.remove("badge--active"))
        currentPage = ev.target.id;
        document.querySelector(".todosAndPaginate .todos").innerHTML = "";
        load(ev.target.id)
    }))
}