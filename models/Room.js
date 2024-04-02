const Fighter = require("./Fighter");
const Archer = require("./Archer");
const Cavary = require("./Cavalry");

var count = 0;

module.exports = class Room {

    static rooms = [];

    id;
    name;
    players = [];
    board = [];
    ready = 0;
    actions = [];
    log = {};

    constructor(name) {
        this.id = ++ count;
        this.name = name;
    }

    static find(id) {
        if (typeof id == "string") {
            id = Number(id);
        }
        for (var room of this.rooms) {
            if (room.id == id) {
                return room;
            }
        }
    }

    static getIndex(id) {
        if (typeof id == "string") {
            id = Number(id);
        }

        for (var i = 0; i < this.rooms.length; i ++) {
            if (this.rooms[i].id == id) {
                return i;
            }
        }
    }

    updatePlayer(player) {
        if (player.id == this.players[0]) {
            this.players[0] = player;
        }
        else if (player.id == this.players[1]) {
            this.players[1] = player;
        }
    }

    perform() {
        console.log("perform");

        var a0 = this.actions[0];
        var a1 = this.actions[1];

        if (a0.action == "fighter") {
            this.log[a0.player.name] = "Place Fighter";
            this.place(new Fighter(a0.player.id), a0.player);
        }
        if (a0.action == "archer") {
            this.log[a0.player.name] = "Place Archer";
            this.place(new Archer(a0.player.id), a0.player);
        }
        if (a0.action == "cavalry") {
            this.log[a0.player.name] = "Place Cavalry";
            this.place(new Cavary(a0.player.id), a0.player);
        }

        if (a1.action == "fighter") {
            this.log[a1.player.name] = "Place Fighter";
            this.place(new Fighter(a1.player.id), a1.player);
        }
        if (a1.action == "archer") {
            this.log[a1.player.name] = "Place Archer";
            this.place(new Archer(a1.player.id), a1.player);
        }
        if (a1.action == "cavalry") {
            this.log[a1.player.name] = "Place Cavalry";
            this.place(new Cavary(a1.player.id), a1.player);
        }

        // if both players want to move to the same location
        if (a0.action == "move" && a1.action == "move") {
            console.log(JSON.stringify(a0.destination));
            console.log(JSON.stringify(a1.destination));
            if (JSON.stringify(a0.destination) == JSON.stringify(a1.destination)) {
                this.log[a0.player.name] = "Destination Conflict";
                this.log[a1.player.name] = "Destination Conflict";
                return;
            }
        }

        if (a0.action == "move") {
            var index = this.getUnitIndex(a0.unit);
            this.board[index].x = a0.destination.x;
            this.board[index].y = a0.destination.y;
            this.log[a0.player.name] = `Move ${this.board[index].name}`;
        }

        if (a1.action == "move") {
            var index = this.getUnitIndex(a1.unit);
            this.board[index].x = a1.destination.x;
            this.board[index].y = a1.destination.y;
            this.log[a1.player.name] = `Move ${this.board[index].name}`;
        }

        if (a0.action == "attack") {
            for (var unit of this.board) {
                if (unit.x == a0.destination.x && unit.y == a0.destination.y) {
                    unit.hp -= a0.unit.atk;
                    var index = this.getUnitIndex(unit);
                    if (unit.hp <= 0) {
                        this.board.splice(index, 1);
                    }
                    else {
                        this.board[index] = unit;
                    }
                }
            }
            if (a0.destination.x == 4) {
                if (a0.destination.y == 0) {
                    this.players[1].hp -= a0.unit.atk;
                }
                if (a0.destination.y == 8) {
                    this.players[0].hp -= a0.unit.atk;
                }
            }
            this.log[a0.player.name] = `${a0.unit.name} Attack`;
        }
        if (a1.action == "attack") {
            for (var unit of this.board) {
                if (unit.x == a1.destination.x && unit.y == a1.destination.y) {
                    unit.hp -= a1.unit.atk;
                    var index = this.getUnitIndex(unit);
                    if (unit.hp <= 0) {
                        this.board.splice(index, 1);
                    }
                    else {
                        this.board[index] = unit;
                    }
                }
            }
            if (a1.destination.x == 4) {
                if (a1.destination.y == 0) {
                    this.players[1].hp -= a1.unit.atk;
                }
                if (a1.destination.y == 8) {
                    this.players[0].hp -= a1.unit.atk;
                }
            }
            this.log[a1.player.name] = `${a1.unit.name} Attack`;
        }
    }

    place(object, player) {
        if (this.players[0].id == Number(player.id)) {
            object.x = 4;
            object.y = 8;
            this.board.push(object);
        }
        else if (this.players[1].id == Number(player.id)) {
            object.x = 4;
            object.y = 0;
            this.board.push(object);
        }
    }

    getUnitIndex(target) {
        for (var i = 0; i < this.board.length; i ++) {
            if (this.board[i].x == target.x && this.board[i].y == target.y) {
                return i;
            }
        }
    }

}