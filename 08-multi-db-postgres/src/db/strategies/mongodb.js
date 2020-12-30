const ICrud = require('./interfaces/interfaceCrud');

class MongoDB extends ICrud {
    constructor() {
        super();
    }

    create(item) {
        console.log('The item was saved in MongoDB!');
    }
}

module.exports = MongoDB;