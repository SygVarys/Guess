let express = require('express');
let router = express.Router();
const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');


const mongodb = require('../storage/mongoDB')
const mongoose = require('../storage/mongooseTeam')
const mongooseMembre = require('../storage/mongoose')


router.get('/', async function(req, res, next) {
  if (typeof req.session.user == 'undefined') {
    res.redirect('/login');
  } else if (req.session.user && req.session.user.role !== 'admin') {
    res.status(403);
    res.render('errors/403');
  }

  try {
    const allTeams = await mongoose.findAllTeams();
    console.log(Object.keys(allTeams))
    for (let team of allTeams){
      console.log("I"  +team)
        //team.populate('users')
      console.log("II" + team)
    }
  // La méthode findAll du fichier storage/users.js permet de récupérer tous les utilisateurs
  res.render('list-teams', { listTeams: allTeams})
} catch (error){
    console.log(error)
  }

});

router.get('/create', async function(req, res, next) {

    try{
        console.log("j'arrive sur la page de création deéquip")
        const allMembres = await mongooseMembre.findAllUsers();
        console.log(Object.keys(allMembres))
        res.render('createTeam', {listMembres : allMembres});
    } catch (error) {
            console.log(error)
    }


  
});

router.post('/create',
  // On détermine plusieurs règles de validation du formulaire
  body('nom').isLength({min : 4}).withMessage('Merci de saisir au moins 4 caractères'),
 /* body('membres').custom(async (value, { req }) => {
    
    console.log()
    const test = await mongoose.findUsersByEmail(value);
    if (Object.keys(test).length>0) {
      throw new Error('Cette adresse email est déjà utilisée');
    }
    return true;
     }),*/
  async function(req, res, next) {

    const errors = validationResult(req);
    let errorMessages = {};
    console.log(errors)
    // L'objet errors contient un champ "errors" qui est un tableau d'objets
    errors.errors.forEach((error) => {
      // On stocke les messages d'erreurs dans un tableau clé-valeur
      errorMessages[error.path] = error.msg;
      console.log("Compte des erreurs " + errorMessages.length);
    });
    console.log(req.body);
    console.log(Object.keys(errorMessages).length)
    console.log(errorMessages.length)
    console.log(JSON.stringify(errorMessages))
    console.log(typeof errorMessages) 
    console.log(errorMessages.length)   
    console.log(errorMessages.length > 0)  
    // S'il y a une erreur, on affiche notre page de login
    if (Object.keys(errorMessages).length > 0) {
      res.render('signup', { messages: errorMessages })
    } else {
      // Hash du mot de passe et enregistrement
      
      //await mongodb.createUser(req.body.pseudo, req.body.email, hashPassword, 'admin')
      await mongoose.createTeam(req.body.nom, req.body.membres)
      // Ancienne commande de rajout d'un utilisateur avec le storage : addUser(req.body.email, hashPassword);
      req.flash('success', 'Votre équipe ' + req.body.nom + ' a bien été créé !');
      // Sinon retour à l'accueil
      res.redirect('/teams');
    }
});

module.exports = router;