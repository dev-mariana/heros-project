const ICrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');
require('dotenv').config();

class Postgres extends ICrud {
    constructor() {
        super();
        this._driver = null,
        this._heros = null
    }

    async isConnected() {
        try {
            await this._driver.authenticate();
            return true;
        } 
        catch (error) {
            console.log('Fail!', error);
        }
    }

    async defineModel() {
        this._heros = this._driver.define('heros', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                required: true
            },
            power: {
                type: Sequelize.STRING,
                required: true
            }
        }, 
        {
          tableName: 'TB_HEROS',
          freezeTableName: false,
          timestamps: false  
        });
    
        await this._heros.sync();
    }
    
    async create(item) {
        const { dataValues } = await this._heros.create(item);
        return dataValues;
    }

    async read(item = {}) {
        return this._heros.findAll({ where: item, raw: true });
    }

    async update(id, item) {
        return this._heros.update(item, { where: {id : id} });
    }

    async delete(id) {
        const query = id ? { id:id } : {};
        return this._heros.destroy({ where: query });
    }

    async connect() {
        this._driver = new Sequelize(
            'heros',
            process.env.USER,
            process.env.PASSWORD,
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: 0
            }
        )

        await this.defineModel();
    }
}

module.exports = Postgres;