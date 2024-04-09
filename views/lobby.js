nav = document.getElementsByTagName("nav")[0];
main = document.getElementsByTagName("main")[0];
createForm = document.getElementById("create");
joinForm = document.getElementById("join");
rooms = [];

fetch("http://board-of-war.luihin903.com/api/rooms")
    .then(response => response.json())
    .then(data => {
        rooms = data["rooms"];
        if (rooms.length == 0) {
            main.innerHTML = "&#8593; no room, create one";
            return;
        }
        for (room of rooms) {
            var section = document.createElement("section");
            var name = document.createElement("p");
            var players = document.createElement("p");

            name.innerHTML = room.name;
            players.innerHTML = `${room.players.length}/2`;
            section.id = room.id;
            name.id = room.id;
            players.id = room.id;
            players.style.textAlign = "right";
            section.addEventListener("click", join);
            
            section.appendChild(name);
            section.appendChild(players);
            main.appendChild(section);
        }
    })

function create() {

    createForm.style.visibility = "visible";
    createForm.style.left = `${window.innerWidth / 2 - createForm.offsetWidth / 2}px`;
    createForm.style.top = `${window.innerHeight / 2 - createForm.offsetHeight / 2}px`;

    nav.classList.add("blur");
    main.classList.add("blur");
    document.getElementsByTagName("header")[0].classList.add("blur");
}

function join(event) {
    for (var room of rooms) {
        if (room.id == Number(event.target.id)) {
            if (room.players.length >= 2) {
                alert(`Room ${room.name} is full.`);
                return;
            }
        }
    }

    document.getElementById("room").value = event.target.id;

    joinForm.style.visibility = "visible";
    joinForm.style.left = `${window.innerWidth / 2 - joinForm.offsetWidth / 2}px`;
    joinForm.style.top = `${window.innerHeight / 2 - joinForm.offsetHeight / 2}px`;

    nav.classList.add("blur");
    main.classList.add("blur");
    document.getElementsByTagName("header")[0].classList.add("blur");
}