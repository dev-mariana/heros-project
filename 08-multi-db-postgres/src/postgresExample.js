//npm i sequelize pg-hstore pg

require('dotenv').config();

const Sequelize = require('sequelize');
const driver = new Sequelize(
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

async function main() {
    const heros = driver.define('heros', {
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

    await heros.sync();
    await heros.create({
        name: 'Superman',
        power: 'Fly and x-ray view'
    });

    const result = await heros.findAll({ raw: true });
    console.log('result', result);
}

main();