const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());
const MOCK_REGISTER_HERO = { name: 'Black Widow', power: 'Fight' };
const MOCK_UPDATE_HERO = { name: 'Batman', power: 'Money' };

describe('Postgres Strategy', function () {
    this.timeout(Infinity);

    before(async () => {
        await context.connect();
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