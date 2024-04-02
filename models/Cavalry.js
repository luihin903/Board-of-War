module.exports = class Cavalry {

    name = "Cavalry";
    hp = 100;
    atk = 50;
    speed = 3;
    range = 1;
    owner; // player id
    x;
    y;
    
    constructor(owner) {
        this.owner = Number(owner);
    }

}