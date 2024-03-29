var count = 0;

module.exports =  class Room {

    id;
    name;

    constructor(name) {
        this.id = ++ count;
        this.name = name;
    }

}