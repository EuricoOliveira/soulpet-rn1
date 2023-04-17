// Modelo para gerar tabela de clientes no MySQL
// Mapeamento: cada propriedade vira uma coluna da tabela

// DataType = serve para definir o tipo da coluno
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Cliente = connection.define("cliente", {
  nome: {
    // Configurar a coluna 'nome'
    type: DataTypes.STRING(130),
    allowNull: false, // NOT NULL
  },
  email: {
    type: DataTypes.STRING, // VARCHAR
    allowNull: false, // NOT NULL
    unique: true, // UNICO
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cliente;