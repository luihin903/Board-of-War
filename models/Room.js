var count = 0;

module.exports = class Room {

    static rooms = [];

    id;
    name;
    players = [];
    board = [[], [], [], [], [], [], [], [], []];
    ready = 0;

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

}