// importando os pacotes para uso no arquivo index.js
const express = require("express");
const cycle = require("cycle");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

// crio um servidor express
const app = express();

// aplico configurações para dentro do servidor express, adicionando middlewares (body-parser, morgan, cors)
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// DB local (tempo de execução)
let data;

const getISteamUserStats = async steamId => {
  let response;

    response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?key=D1108BDE58274899E11D3C55998E2D60&steamid=${steamId}&format=json&appid=730`)
    return response;
};

const ErrorMessage = status => {
  let message;
  switch(status){
    case 403:
      message = 'Você não tem permissão';
    break;
    default:
      message = "Usuário não existe";
  }
  return message;
}

// criação de rota que será acessada utilizando o método HTTP GET/
// http://localhost:9000/
app.get("/:id", async (req, res) => {
  let returnResponse;
  try{
    data = await getISteamUserStats(req.params.id);
    console.log('--------------------- SUCESS ---------------------')
    returnResponse = data.data;
    return res.json(cycle.decycle(returnResponse));
  }
  catch(err){
    const {status} = err.response;
    console.log(status);
    res.statusCode = status;
    return res.json({"error": status, "message":ErrorMessage(status) });
  }
 


});

// criação de rota que será acessada utilizando o método HTTP POST/
// http://localhost:9000/add
app.post("/add", (req, res) => {
  const result = req.body;

  if (!result) {
    return res.status(400).end();
  }

  data.push(result);
  return res.json({ result });
});

// o servidor irá rodar dentro da porta 9000
app.listen(9000, () => console.log("Express started at http://localhost:9000"));
