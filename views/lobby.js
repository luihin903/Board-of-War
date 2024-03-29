main = document.getElementsByTagName("main")[0];
form = document.getElementsByTagName("form")[0];
rooms = [];

fetch("http://localhost:3000/api/rooms")
    .then(response => response.json())
    .then(data => {
        rooms = data["rooms"];
        console.log(rooms);
        if (rooms.length == 0) {
            main.innerHTML = "no room";
            return;
        }
        for (room of rooms) {
            var section = document.createElement("section");
            var name = document.createElement("p");
            name.innerHTML = room.name;
            section.appendChild(name);
            main.appendChild(section);
        }
    })

function create() {

    form.style.visibility = "visible";
    form.style.left = `${window.innerWidth / 2 - form.offsetWidth / 2}px`;
    form.style.top = `${window.innerHeight / 2 - form.offsetHeight / 2}px`;

    document.getElementsByTagName("nav")[0].classList.add("blur");
    main.classList.add("blur");

}