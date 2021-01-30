const Sequelize = require("sequelize");

const HerosSchema = {
  name: "Heros",
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    power: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    tableName: "TB_HEROS",
    freezeTableName: false,
    timestamps: false,
  }
};

module.exports = HerosSchema;