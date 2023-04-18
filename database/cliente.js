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

// Associação 1:1 (one-to-one)
// Endereço ganha uma chave estrangeira (nome do model + Id)
const Endereco = require("./endereco");
Cliente.hasOne(Endereco) // Cliente tem 1 endereço
Endereco.belongsTo(Cliente) // Endereço só tem 1 cliente

module.exports = Cliente;