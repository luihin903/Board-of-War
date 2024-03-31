var count = 0;

module.exports = class Player {

    id;
    name;

    resources = { money : 10 , food : 10 , metal : 5 , wood : 5 };
    sources = { resident : 1 , farm : 1 , mine : 1 , forest : 1 };

    constructor(name) {
        this.id = ++ count;
        this.name = name;
    }

}