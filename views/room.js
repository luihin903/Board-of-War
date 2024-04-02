var room;
var player;
var header = document.getElementsByTagName("header")[0];
var main = document.getElementsByTagName("main")[0];
var body = document.getElementsByTagName("body")[0];
var board = getE("board");
var spawn;
var other;
var cards = getE("cards");
var message = getE("message");
var actions = getE("actions");
var targetUnit;
var hp = document.getElementsByClassName("hp");
var last = document.getElementsByClassName("last");
var action;
var no = getE("no");
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
    move : { money : 1 , food : 1 , metal : 1 , wood : 1 },
    attack : { money : 1 , food : 1 , metal : 1 , wood : 1 },

    food : { money : 1 },
    metal : { money : 1 },
    wood : { money : 1 },

    resident : { money : 1 , metal : 2 , wood : 2 },
    farm : { money : 2 , wood : 1 },
    mine : { money : 2 , wood : 1 },
    forest : { money : 2 },

    fighter : { money : 10 , food : 10 },
    archer : { money : 10 , wood : 10 },
    cavalry : { money : 10 , metal : 10 }
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

function updateBoard(log) {
    for (var cell of document.getElementsByClassName("cell")) {
        cell.innerHTML = "";
    }

    for (var unit of room.board) {
        var cell = getCell(unit);
        cell.innerHTML = `${unit.name}<br>(${unit.hp})`;
        cell.style.color = (unit.owner == player.id) ? "cyan" : "red";
    }

    hp[0].innerHTML = room.players[0].name;
    hp[1].innerHTML = room.players[0].hp;
    hp[2].innerHTML = room.players[1].name;
    hp[3].innerHTML = room.players[1].hp;

    last[0].innerHTML = room.players[0].name;
    last[1].innerHTML = log[room.players[0].name];
    last[2].innerHTML = room.players[1].name;
    last[3].innerHTML = log[room.players[1].name];
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
    block();
    fetch("http://198.217.116.201/room/ready", {
        method : "post",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify({ room : room.id , player : player })
    })
        .then(response => response.json())
        .then(data => {
            room = data.room;
            setCombat();
        })
}

function init() {
    
    fetch("http://198.217.116.201/room/init", { method : "get"})
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

            body.classList.remove("blur");
            
            if (room.players.length < 2) {
                message.innerHTML = "Waiting for player to join...";
                block();
                fetch("http://198.217.116.201/room/wait", {
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
                        setPrepare();
                        unblock();
                    })
            }
            else {
                setPrepare();
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

    other = getCellByPos(4, 0);
    other.classList.add("other");
    getCellByPos(3, 0).style.borderRight = "none";
    getCellByPos(4, 1).style.borderTop = "none";
    getCellByPos(5, 0).style.borderLeft = "none";
    
    spawn = getCellByPos(4, 8);
    spawn.classList.add("this");
    getCellByPos(3, 8).style.borderRight = "none";
    getCellByPos(4, 7).style.borderBottom = "none";
    getCellByPos(5, 8).style.borderLeft = "none";
}

function setPrepare() {
    for (var unit of room.board) {
        if (unit.owner == player.id) {
            player.resources.food --;
        }
    }

    player.resources.money += player.sources.resident;
    player.resources.food += player.sources.farm;
    player.resources.metal += player.sources.mine;
    player.resources.wood += player.sources.forest;

    updateValue();

    message.innerHTML = "Prepare Stage";
    actions.style.visibility = "hidden";
    no.style.visibility = "hidden";
    cards.style.visibility = "visible";
    getE("ready").visibility = "visible";
}

function setCombat() {
    message.innerHTML = "Combat Stage";
    cards.style.visibility = "hidden";
    getE("ready").style.visibility = "hidden";
    board.classList.remove("prepare");
    board.classList.add("combat");
    actions.style.visibility = "visible";
    no.style.visibility = "visible";
    unblock();
}

function perform(target) {
    block();
    var x = Number(target.dataset.x);
    var y = Number(player.order == 0 ? target.dataset.y : 8 - target.dataset.y);
    fetch(`http://198.217.116.201/room/perform`, {
        method : "post",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify({
            action : action,
            unit : targetUnit,
            player : player,
            room : room.id,
            destination : { x, y }
        })
    })
        .then(response => response.json())
        .then(data => {
            room = data.room;
            updateBoard(data.log);
            if (data.log[player.name] != "Destination Conflict") {
                player.actions[action] --;
                updateValue();
            }
            unblock();

            if (Number(room.players[0].hp) <= 0 && Number(room.players[1].hp) <= 0) {
                message.innerHTML = "It is a draw/tie.";
                block();
            }
            else if (Number(room.players[0].hp) <= 0) {
                message.innerHTML = `Congratulations to ${room.players[1].name}!`;
                block();
            }
            else if (Number(room.players[1].hp) <= 0) {
                message.innerHTML = `Congratulations to ${room.players[0].name}!`;
                block();
            }
        })
}

function act(target) {

    if (target == "no") {
        block();
        fetch("http://198.217.116.201/room/no", {
            method : "post",
            headers : { "Content-Type" : "application/json"},
            body : JSON.stringify({
                room : room.id,
                player : player
            })
        })
            .then(response => response.json())
            .then(data => {
                room = data.room;
                updateBoard(data.log);
                if (data.log[room.players[0].name] == "No Action" && data.log[room.players[1].name] == "No Action") {
                    setPrepare();
                }
                unblock();

                if (Number(room.players[0].hp) <= 0 && Number(room.players[1].hp) <= 0) {
                    message.innerHTML = "It is a draw/tie.";
                    block();
                }
                else if (Number(room.players[0].hp) <= 0) {
                    message.innerHTML = `Congratulations to ${room.players[1].name}!`;
                    block();
                }
                else if (Number(room.players[1].hp) <= 0) {
                    message.innerHTML = `Congratulations to ${room.players[0].name}!`;
                    block();
                }
            })
    }

    if (player.actions[target] <= 0) {
        alert(`You have no ${target} card.`);
        return;
    }

    if (target == "move") {
        for (var unit of room.board) {
            if (unit.owner == player.id) {
                action = "move";
                pick();
                return;
            }
        }
        alert("You have no unit to move.");
    }

    else if (target == "attack") {
        for (var unit of room.board) {
            if (unit.owner == player.id) {
                action = "attack";
                pick();
                return;
            }
        }
        alert("You have no unit to attack.");
    }
    
}

// pick unit
function pick() {

    for (var cell of Array.from(document.getElementsByClassName("select"))) {
        cell.classList.remove("select");
        cell.removeEventListener("click", selectTarget, true);
        cell.removeEventListener("click", selectDestination, true);
    }

    for (let unit of room.board) {
        if (unit.owner == player.id) {
            var cell = getCell(unit);
            cell.classList.add("select");
            cell.addEventListener("click", selectTarget, true);
        }
    }
}

function selectTarget(event) {
    for (var unit of room.board) {
        if (unit.x == event.target.dataset.x && unit.y == (player.order == 0 ? event.target.dataset.y : 8 - event.target.dataset.y)) {
            targetUnit = unit;
        }
    }

    var cells = document.getElementsByClassName("select");
    for (var cell of Array.from(cells)) {
        cell.classList.remove("select");
        cell.removeEventListener("click", selectTarget, true);
    }
    seek();
}

// pick destination to move/attack
function seek() {
    for (var x = 0; x < 9; x ++) {
        for (var y = 0; y < 9; y ++) {
            if (dist(targetUnit, x, y) <= (action == "move" ? targetUnit.speed : targetUnit.range)) {
                var cell = getCellByPos(x, player.order == 0 ? y : 8 - y);

                if (action == "attack" || (cell.innerHTML == "" && cell != spawn && cell != other)) {
                    cell.classList.add("select");
                    cell.addEventListener("click", selectDestination, true);
                }
            }
        }
    }
}

function selectDestination(event) {
    var cells = document.getElementsByClassName("select");
    for (var c of Array.from(cells)) {
        c.classList.remove("select");
        c.removeEventListener("click", selectDestination, true);
    }
    perform(event.target);
}

function place(target) {
    if (player.units[target] <= 0) {
        alert(`You have no ${target} card.`);
        return;
    }

    if (spawn.innerHTML != "") {
        alert("Your spawn is occupied.");
        return;
    }

    player.units[target] --;
    updateValue();
    block();
    message.innerHTML = "Waiting for opponent to action...";
    fetch("http://198.217.116.201/room/action", {
        method : "post",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify({
            room : room.id,
            player : player,
            action : target
        })
    })
        .then(response => response.json())
        .then(data => {
            room = data.room;
            updateBoard(data.log);
            message.innerHTML = "Combat Stage";
            unblock();
        })
}

function getCell(unit) {
    return document.querySelector(`[data-x = '${unit.x}'][data-y = '${player.order == 0 ? unit.y : 8 - unit.y}']`);
}

function getCellByPos(x, y) {
    return document.querySelector(`[data-x = '${x}'][data-y = '${y}']`);
}

// calculate in room pos
function dist(unit, x, y) {
    return Math.sqrt((unit.x - x) ** 2 + (unit.y - y) ** 2);
}

function block() {
    main.classList.add("blur");
}

function unblock() {
    main.classList.remove("blur");
}