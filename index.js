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
const Pet = require("./database/pet");

// DEFINIÇÃO DE ROTAS
app.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

app.get("/clientes/:id", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 5;
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco],
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});

app.post("/clientes", async (req, res) => {
  // - coletar informação do req.body
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Dentro de 'novo' estará o objeto criado
    const novo = await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] } // Permite inserir cliente e endereço num comando
    );
    res.status(201).json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// PUT (/clientes) => Atualizar cliente existente
// 2.PUT (/clientes) => atualizar cliente existente
app.put("/clientes/:id", async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  const { id } = req.params;

  try {
    const cliente = await Cliente.findOne({ where: { id } });
    if (cliente) {
      // 2.1. checa a atualizacao do endereço
      if (endereco) {
        //2.1.1. qd o clienteId de Endereco for = id do cliente fornecido em /clientes/:id
        await Endereco.update(endereco, { where: { clienteId: id } });
      }
      // dps de verificar se tem endereco, verifica se ha atualizacao nas demais informacoes
      await cliente.update({ nome, email, telefone }); //, { where: { id } } ); << esse where eu coloco se for usar o Cliente com "C".
      // resposta e qual cliente editado
      res.status(200).json({ message: "Cliente editado." });
    } else {
      //resposta se nao encontrar o cliente
      res.status(404).json({ message: "Cliente nao encontrado." });
    }
  } catch (err) {
    // não consegue consultar o bd por algum motivo
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// 3. DEL (/clientes/) => deletar o cliente
app.delete("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findOne({ where: { id } });
  try {
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente removido." });
    } else {
      res.status(404).json({ message: "Cliente nao encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

app.post("/pets", async (req, res) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    } else {
      const novo = await Pet.create({ nome, tipo, porte, dataNasc, clienteId });
      res.status(201).json(novo);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

app.get("/pets", async (req, res) => {
  const listaPets = await Pet.findAll();
  res.json(listaPets);
});

app.get("/pets/:id", async (req, res) => {
  const { id } = req.params;

  const pet = await Pet.findByPk(id);
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: "Pet não encontrado." });
  }
});


// ESCUTA DE EVENTOS (LISTEN)
app.listen(3000, () => {
  connection.sync({ force: true }); // Gerar as tabelas a partir do model // Force = apaga tudo e recrie as tabelas
  console.log("Servidor rodando em http://localhost3000/");
});
