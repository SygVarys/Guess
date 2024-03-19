var express = require('express');
var router = express.Router();
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');

let numberToFind = 0;

router.get('/', function(req, res, next) {
  if (!numberToFind) {
    // On génère un nombre aléatoire
    numberToFind = RandomNumber.generate();
  }
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  // On récupère le nombre du joueur à partir du formulaire et on le parse en int
  const attempt = parseInt(req.body.attempt);
  // On récupère le champ caché du formulaire si l'utilisateur a gagné
  const playAgain = req.body.playAgain;

  if (playAgain) {
    numberToFind = RandomNumber.generate();
    res.render('index');
  }
  // On vérifie si le joueur a trouvé le nombre
  const response = tryNumber(attempt, numberToFind);

  // On retourne le résultat au template
  res.render('index', { message: response.text, resultType: response.resultType, numberToFind: numberToFind });
});

module.exports = router;
