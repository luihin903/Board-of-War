var count = 0;

module.exports = class Player {

    id;
    name;

    actions = { move : 0 , attack : 0};
    resources = { money : 10 , food : 10 , metal : 5 , wood : 5 };
    sources = { resident : 0 , farm : 0 , mine : 0 , forest : 0 };
    actions = { move : 0 , attack : 0};
    units = { fighter : 0 , archer : 0 , cavalry : 0 };

    constructor(name) {
        this.id = ++ count;
        this.name = name;
    }

}