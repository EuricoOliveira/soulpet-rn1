// Importações principais e variáveis de ambiente
require("dotenv").config(); // Vai disponibilizar o uso de variáveis de ambiente
const express = require("express");
const morgan = require("morgan");

// CONFIGURAÇÃO DO APP
const app = express();
app.use(express.json()); // possibilitar transitar dados usando JSON
app.use(morgan("dev"));

// CONFIGURAÇÃO DO BANCO DE DADOS
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão

// DEFINIÇÃO DE ROTAS
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

// JUNTAR AO APP AS ROTAS DOS ARQUIVOS
// Configurar o grupo de rotas no app
app.use(rotasClientes); 
app.use(rotasPets);

// ESCUTA DE EVENTOS (LISTEN)
app.listen(3000, () => {
  // Force = apaga tudo e recrie as tabelas
  // Gerar as tabelas a partir do model
  connection.sync(); 
  console.log("Servidor rodando em http://localhost3000/");
});
