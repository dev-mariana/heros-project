const ICrud = require("./../interfaces/interfaceCrud");
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
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = Status[this._connection.readyState];

    if(state === 'Conectado') return state;

    if(state !== 'Conectando') return state;
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Status[this._connection.readyState];
  }

  static connect() {
    Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
        if (!error) return;
        console.log("Connection Fail!", error);
      }
    );

    const connection = Mongoose.connection;
    connection.on('open', () => console.log('database is running!'));
    return connection;
  }

  create(item) {
    return this._schema.create(item);
  }

  //retorna o resultado de 10 itens por página e o skip ignora os primeiros resultados
  read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
