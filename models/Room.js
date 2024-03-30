var count = 0;

module.exports =  class Room {

    id;
    name;
    players;
    static rooms = [];

    constructor(name) {
        this.id = ++ count;
        this.name = name;
        this.players = [];
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

}