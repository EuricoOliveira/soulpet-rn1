const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");

const { Router } = require("express");

// Criar o grupo de rotas (/clientes)
const router = Router();

// DEFINIÇÃO DE ROTAS
router.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

router.get("/clientes/:id", async (req, res) => {
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

router.post("/clientes", async (req, res) => {
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
router.put("/clientes/:id", async (req, res) => {
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
router.delete("/clientes/:id", async (req, res) => {
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

module.exports = router;
