// Importações principais e variáveis de ambiente
require("dotenv").config(); // Vai disponibilizar o uso de variáveis de ambiente
const express = require("express");

// CONFIGURAÇÃO DO APP
const app = express();
app.use(express.json()); // possibilitar transitar dados usando JSON

// CONFIGURAÇÃO DO BANCO DE DADOS
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão
const Cliente = require("./database/cliente"); // Configurar o model da aplicação
const Endereco = require("./database/endereco");

// DEFINIÇÃO DE ROTAS

// ESCUTA DE EVENTOS (LISTEN)
app.listen(3000, () => {
    connection.sync({force: true}) // Gerar as tabelas a partir do model // Force = apaga tudo e recrie as tabelas
    console.log("Servidor rodando em http://localhost3000/");
});