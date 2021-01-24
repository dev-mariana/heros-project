const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_REGISTER_HERO = {
    name: 'Wonder Woman',
    power: 'tie'
};

const MOCK_DEFAULT_HERO = {
    name: `Black Window-${Date.now()}`,
    power: 'Fight'
};

const MOCK_UPDATE_HERO = {
    name: `Captain Marvel`,
    power: 'Force and Fly'
};

let MOCK_HERO_ID = '';
const context = new Context(new MongoDB());

describe('MongoDB Teste Suit', () => {
    before(async () => {
        await context.connect();
        await context.create(MOCK_DEFAULT_HERO);
        const result = await context.create(MOCK_UPDATE_HERO);
        MOCK_HERO_ID = result._id;
    })

    it('Check Connection', async () => {
        const result = await context.isConnected();
        const expect = 'Conectado';
        assert.deepStrictEqual(result, expect);
    })

    it('Register', async () => {
        const { name, power } = await context.create(MOCK_REGISTER_HERO);
        assert.deepStrictEqual({ name, power }, MOCK_REGISTER_HERO);
    })

    it('List', async () => {
        const [{ name, power }] = await context.read({ name: MOCK_DEFAULT_HERO.name });
        const result = { name, power };
        assert.deepStrictEqual(result, MOCK_DEFAULT_HERO);
    })

    it('Update', async () => {
        const result = await context.update(MOCK_HERO_ID, {
            name: 'Supergirl'
        });
        assert.deepStrictEqual(result.nModified, 1);
    })

    it('Remove', async () => {
        const result = await context.delete(MOCK_HERO_ID);
        assert.deepStrictEqual(result.n, 1);
    })
})