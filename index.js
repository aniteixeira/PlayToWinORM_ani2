require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo")
const express = require("express");
const handlebars = require("express-handlebars"); 
const { where } = require("sequelize");
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req,res)=>{
    res.render("home");
}) 

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({ raw: true })
    res.render("usuarios",{usuarios});
})

app.get("/usuarios/novo", (req, res) => {
    res.render("formUsuario");
});

app.post("/usuarios/novo", async (req, res) => {
    try {
        const { nickname, nome } = req.body;
        
        const dadosUsuario = {
            nickname,
            nome,
        };
        const usuario = await Usuario.create(dadosUsuario);

        res.send("Usuário inserido sob o id " + usuario.id);
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).send("Erro ao inserir usuário");
    }
});

app.get("/jogos/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formJogo.handlebars`);
});

app.post("/jogos/novo", async (req, res) => {
    try {
        const { titulo, descricao, precoBase} = req.body;
        
        const dadosJogo = {
            titulo,
            descricao, 
            precoBase,
        };
        const jogo = await Jogo.create(dadosJogo);
        console.log(jogo)

        res.send("Jogo inserido sob o id " + jogo.id);
    } catch (error) {
        console.error("Erro ao inserir jogo:", error);
        res.status(500).send("Erro ao inserir jogo");
    }
});

app.get("/usuarios/:id/update", async (req, res)=>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true});

    res.render("formUsuario",{usuario})
});

app.post("/usuarios/:id/update", async (req,res) => {
    const id = parseInt(req.params.id);
    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    }
    const retorno = await Usuario.update({dadosUsuario, where: {id:id}});

    if (retorno > 0){
        res.redirect("/usuarios/novo");
    }
    else {
        res.send("Erro ao atualizar usuario!")
    }
});