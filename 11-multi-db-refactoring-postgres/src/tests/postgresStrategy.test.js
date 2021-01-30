const assert = require('assert');
const Postgres = require('./../db/strategies/postgres/postgres');
const HerosSchema = require('./../db/strategies/postgres/schemas/herosSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_REGISTER_HERO = { name: 'Black Widow', power: 'Fight' };
const MOCK_UPDATE_HERO = { name: 'Batman', power: 'Money' };

let context = {};

describe('Postgres Strategy', function () {
    this.timeout(Infinity);

    before(async () => {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, HerosSchema);
        context = new Context(new Postgres(connection, model));
        await context.delete();
        await context.create(MOCK_UPDATE_HERO);
    })

    it('PostgreSQL Connection', async () => {
        const result = await context.isConnected();
        assert.deepStrictEqual(result, true);
    })

    it('Register', async () => {
        const result = await context.create(MOCK_REGISTER_HERO);
        delete result.id;
        assert.deepStrictEqual(result, MOCK_REGISTER_HERO);
    })

    it('Read', async () => {
        const [result] = await context.read({ name: MOCK_REGISTER_HERO.name });
        delete result.id;
        assert.deepStrictEqual(result, MOCK_REGISTER_HERO);
    })

    it('Update', async () => {
        const [updateItem] = await context.read({ name: MOCK_UPDATE_HERO.name });
        const newItem = {
            ...MOCK_UPDATE_HERO,
            name: 'Flash'
        };
        const [result] = await context.update(updateItem.id, newItem);
        const [updatedItem] = await context.read({ id: updateItem.id });
        assert.deepStrictEqual(result, 1);
        assert.deepStrictEqual(updatedItem.name, newItem.name);
    })

    it('Remove by id', async () => {
        const [item] = await context.read({});
        const result = await context.delete(item.id);
        assert.deepStrictEqual(result, 1);
    })
})