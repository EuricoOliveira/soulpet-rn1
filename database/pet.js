const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");

const Pet = connection.define("pet", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  porte: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
  },
});

// Relacionamento 1:N (Um cliente pode ter any pets)
Cliente.hasMany(Pet, { onDelete: "CASCADE" });
// CASCADE = Quando o cliente for deletado, TODOS os pets serão deletados também
Pet.belongsTo(Cliente); // Um pet pertence a 1 cliente

module.exports = Pet;
