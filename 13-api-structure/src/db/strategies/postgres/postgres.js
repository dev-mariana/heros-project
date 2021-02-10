const ICrud = require('../interfaces/interfaceCrud');
const Sequelize = require('sequelize');
require('dotenv').config();

class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }

    async isConnected() {
        try {
            await this._connection.authenticate();
            return true;
        } 
        catch (error) {
            console.log('Fail!', error);
        }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );

        await model.sync();
        return model;
    }
    
    async create(item) {
        const { dataValues } = await this._schema.create(item);
        return dataValues;
    }

    async read(item = {}) {
        return this._schema.findAll({ where: item, raw: true });
    }

    async update(id, item) {
        return this._schema.update(item, { where: {id : id} });
    }

    async delete(id) {
        const query = id ? { id:id } : {};
        return this._schema.destroy({ where: query });
    }

    static async connect() {
        const connection = new Sequelize(
            'heros',
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: 0,
                logging: false
            }
        )

        return connection;
    }
}

module.exports = Postgres;