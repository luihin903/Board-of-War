var count = 0;

module.exports = class Player {

    id;
    name;

    constructor(name) {
        this.id = ++ count;
        this.name = name;
    }

}