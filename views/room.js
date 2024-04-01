var room;
var player;
var header = document.getElementsByTagName("header")[0];
var main = document.getElementsByTagName("main")[0];
var board = getE("board");
var spawn;
var cards = getE("cards");
var message = getE("message");
var ready = getE("ready");
var table = {
    move : getE("move"),
    attack : getE("attack"),

    money : getE("money"),
    food : getE("food"),
    metal : getE("metal"),
    wood : getE("wood"),

    resident : getE("resident"),
    farm : getE("farm"),
    mine : getE("mine"),
    forest : getE("forest"),

    fighter : getE("fighter"),
    archer : getE("archer"),
    cavalry : getE("cavalry")
}
var prices = {
    move : { money : 1 },
    attack : { money : 1 },

    food : { money : 1 },
    metal : { money : 1 },
    wood : { money : 1 },

    resident : { money : 1 , metal : 1 , wood : 1},
    farm : { money : 1 , wood : 1},
    mine : { money : 1 , wood : 1 },
    forest : { money : 1 },

    fighter : { money : 1 , food : 1 },
    archer : { money : 1 , wood : 1 },
    cavalry : { money : 1 , metal : 1 }
}


init();


function getE(id) {
    return document.getElementById(id);
}

function updateValue() {
    table.money.innerHTML = player.resources.money;
    table.food.innerHTML = player.resources.food;
    table.metal.innerHTML = player.resources.metal;
    table.wood.innerHTML = player.resources.wood;

    table.resident.innerHTML = player.sources.resident;
    table.farm.innerHTML = player.sources.farm;
    table.mine.innerHTML = player.sources.mine;
    table.forest.innerHTML = player.sources.forest;

    table.move.innerHTML = player.actions.move;
    table.attack.innerHTML = player.actions.attack;

    table.fighter.innerHTML = player.units.fighter;
    table.archer.innerHTML = player.units.archer;
    table.cavalry.innerHTML = player.units.cavalry;
}

function buy(target) {
    for (var resource of Object.keys(prices[target])) {
        if (player.resources[resource] < prices[target][resource]) {
            alert(`Not enough ${resource}.`);
            return;
        }
    }

    for (var resource of Object.keys(prices[target])) {
        player.resources[resource] -= prices[target][resource];
    }

    if (player.actions[target] != undefined) {
        player.actions[target] ++;
    }
    else if (player.resources[target] != undefined) {
        player.resources[target] ++;
    }
    else if (player.sources[target] != undefined) {
        player.sources[target] ++;
    }
    else if (player.units[target] != undefined) {
        player.units[target] ++;
    }

    updateValue();
}

function ready() {
    message.innerHTML = "Waiting for opponent to be ready...";
    fetch("http://localhost:3000/room/ready", {
        method : "post",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify({ room : room.id , player : player })
    })
        .then(response => response.json())
        .then(data => {
            room = data.room;
            message.innerHTML = "Combat Stage";
            cards.style.visibility = "hidden";
            ready.style.visibility = "hidden";
        })
}

function init() {

    fetch("http://localhost:3000/room/init", { method : "get"})
        .then(response => response.json())
        .then(data => {
            room = data.room;
            player = data.player;
            document.getElementsByTagName("title")[0].innerHTML = room.name;

            updateValue();

            for (p of room.players) {
                var span = document.createElement("span");
                span.innerHTML = p.name;
                span.classList.add("player");
                header.appendChild(span);
            }
            if (room.players.length < 2) {
                message.innerHTML = "Waiting for player to join...";
                main.classList.add("blur");
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
                        message.innerHTML = "Prepare Stage";
                        main.classList.remove("blur");
                    })
            }
            else {
                message.innerHTML = "Prepare Stage";
            }
        })

    for (var i = 0; i < 9; i ++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < 9; j ++) {
            var td = document.createElement("td");
            // var img = document.createElement("img");
            // img.src = "../assets/Empty.png";
            td.dataset.x = j;
            td.dataset.y = i;
            td.classList.add("cell");
            // td.appendChild(img);
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }

    document.querySelectorAll("[data-x='4'][data-y='0']")[0].classList.add("other");
    document.querySelectorAll("[data-x='4'][data-y='0']")[0].classList.add("spawn");
    spawn = document.querySelector("[data-x = '4'][data-y = '8'");
    spawn.classList.add("this");
    spawn.classList.add("spawn");
}