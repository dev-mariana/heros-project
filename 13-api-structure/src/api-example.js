const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HerosSchema = require('./db/strategies/mongodb/schemas/herosSchema');
require('dotenv').config();

async function init() {
    const app = Hapi.Server({
        port: 5000,
        host: 'localhost'
    });

    const connection = MongoDB.connect();
    console.log('connection', connection)
    const context = new Context(new MongoDB(connection, HerosSchema));

    app.route({
            path: '/heros',
            method: 'GET',
            handler: (request, head) => {
                return context.read();
            }
        })

    await app.start();
    console.log(`Server is running on the port: ${app.info.port}`);
}

module.exports = init();