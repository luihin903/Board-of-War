module.exports = class Archer {

    name = "Archer";
    hp = 100;
    atk = 50;
    speed = 1;
    range = 5;
    owner; // player id
    x;
    y;

    constructor(owner) {
        this.owner = Number(owner);
    }

}