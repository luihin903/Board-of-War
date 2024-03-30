var room;
var player;
var header = document.getElementsByTagName("header")[0];
var main = document.getElementsByTagName("main")[0];

fetch("http://localhost:3000/room/init", { method : "get"})
    .then(response => response.json())
    .then(data => {
        room = data.room;
        player = data.player;
        console.log(room);
        console.log(player);
        document.getElementsByTagName("title")[0].innerHTML = room.name;
        for (p of room.players) {
            var span = document.createElement("span");
            span.innerHTML = p.name;
            span.classList.add("player");
            header.appendChild(span);
        }
        if (room.players.length < 2) {
            main.innerHTML = "Waiting for player to join";
            fetch("http://localhost:3000/room/wait", {
                method : "post",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify({ id : room.id })
            })
                .then(response => response.json())
                .then(data => {
                    room = data.room;
                    var span = document.createElement("span");
                    span.innerHTML = room.players[1].name;
                    span.classList.add("player");
                    header.appendChild(span);
                })
        }
    })