const ICrud = require("./interfaces/interfaceCrud");
const Mongoose = require('mongoose');
require('dotenv').config();
const Status = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
};
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`;

class MongoDB extends ICrud {
  constructor() {
    super();
    this._heros = null;
    this._driver = null;
  }

  async isConnected() {
    const state = Status[this._driver.readyState];

    if(state === 'Conectado') return state;

    if(state !== 'Conectando') return state;
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Status[this._driver.readyState];
  }

  defineModel() {
    const heroSchema = new Mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        power: {
            type: String,
            required: true,
        },
        insertedAt: {
            type: Date,
            default: new Date()
        }
    })
    
    this._heros = Mongoose.model('heros', heroSchema);
  }

  connect() {
    Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
        if (!error) return;
        console.log("Connection Fail!", error);
      }
    );

    const connection = Mongoose.connection;
    this._driver = connection;
    connection.once('open', () => console.log('database running!'));

    this.defineModel();
  }

  create(item) {
    return this._heros.create(item);
  }

  //retorna o resultado de 10 itens por página e o skip ignora os primeiros resultados
  read(item, skip = 0, limit = 10) {
    return this._heros.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._heros.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._heros.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
