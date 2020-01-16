// importando os pacotes para uso no arquivo index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require("axios");

// crio um servidor express
const app = express();

// aplico configurações para dentro do servidor express, adicionando middlewares (body-parser, morgan, cors)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// DB local (tempo de execução)
var data = [];
axios
  .get(
    "https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?key=D1108BDE58274899E11D3C55998E2D60&steamid=76561198145496259&format=json&appid=730"
  )
  .then(response => data = (response.data));
  



// criação de rota que será acessada utilizando o método HTTP GET/
// http://localhost:9000/
app.get('/', (req, res) => {
  return res.json({ data });
});

// criação de rota que será acessada utilizando o método HTTP POST/
// http://localhost:9000/add
app.post('/add', (req, res) => {
  const result = req.body;

  if (!result) {
    return res.status(400).end();
  }

  data.push(result);
  return res.json({ result });
});

// o servidor irá rodar dentro da porta 9000
app.listen(9000, () => console.log('Express started at http://localhost:9000'));