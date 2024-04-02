module.exports = class Fighter {

    name = "Fighter";
    hp = 200;
    atk = 50;
    speed = 1;
    range = 1;
    owner; // player id
    x;
    y;

    constructor(owner) {
        this.owner = Number(owner);
    }

}