var count = 0;

module.exports = class Player {

    id;
    name;
    hp = 500;
    order;

    resources = { money : 15 , food : 15 , metal : 10 , wood : 10 };
    sources = { resident : 1 , farm : 1 , mine : 0 , forest : 0 };
    actions = { move : 0 , attack : 0 , equip : 0 };
    units = { fighter : 0 , archer : 0 , cavalry : 0 };
    items = { armor : 0 };

    constructor(name, order) {
        this.id = ++ count;
        this.name = name;
        this.order = order;
    }

}