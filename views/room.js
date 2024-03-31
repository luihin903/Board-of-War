var room;
var player;
var header = document.getElementsByTagName("header")[0];
var main = document.getElementsByTagName("main")[0];
var table = {
    money : getE("money"),
    food : getE("food"),
    metal : getE("metal"),
    wood : getE("wood"),

    resident : getE("resident"),
    farm : getE("farm"),
    mine : getE("mine"),
    forest : getE("forest")
}
var prices = {
    food : { money : 1 },
    metal : { money : 1 },
    wood : { money : 1 },
    resident : { money : 1 , metal : 1 , wood : 1},
    farm : { money : 1 , wood : 1},
    mine : { money : 1 , wood : 1 },
    forest : { money : 1 }
}

fetch("http://localhost:3000/room/init", { method : "get"})
    .then(response => response.json())
    .then(data => {
        room = data.room;
        player = data.player;
        console.log(room);
        console.log(player);
        document.getElementsByTagName("title")[0].innerHTML = room.name;

        updateValue();

        for (p of room.players) {
            var span = document.createElement("span");
            span.innerHTML = p.name;
            span.classList.add("player");
            header.appendChild(span);
        }
        if (room.players.length < 2) {
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

    if (player.resources[target] != undefined) {
        player.resources[target] ++;
    }
    if (player.sources[target] != undefined) {
        player.sources[target] ++;
    }

    updateValue();
}