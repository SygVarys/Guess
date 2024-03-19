let express = require('express');
let router = express.Router();
const { body, validationResult } = require('express-validator');
const { addUser, findByEmail, findAll } = require('../storage/users');
const argon2 = require('argon2');


const mongodb = require('../storage/mongoDB')
const mongoose = require('../storage/mongoose')

router.get('/', async function(req, res, next) {
  if (typeof req.session.user == 'undefined') {
    res.redirect('/login');
  } else if (req.session.user && req.session.user.role !== 'admin') {
    res.status(403);
    res.render('errors/403');
  }

  try {
   
  
  //const allUsers = await mongodb.findAllUsers();
 
    const allUsers = await mongoose.findAllUsers();

  // La méthode findAll du fichier storage/users.js permet de récupérer tous les utilisateurs
  res.render('list-users', { listUsers: allUsers})
} catch (error){
    console.log(error)
  }

});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup',
  // On détermine plusieurs règles de validation du formulaire
  body('email').isEmail().withMessage('Merci de saisir une adresse email valide'),
  body('pseudo').isLength({min : 3}).withMessage('Merci de saisir au moins 3 caractères'),
  // La méthode custom permet de déterminer ses propres règles
  body('email').custom(async (value, { req }) => {
    if (value.length != 0 ){
    //const test = mongodb.findUsersByEmail(value)
    //   if (test.length > 0) {
    //   throw new Error('Cette adresse email est déjà utilisée');
    // }}
    // return true;
    // }),

    const test = await mongoose.findUsersByEmail(value);
    if (Object.keys(test).length>0) {
      throw new Error('Cette adresse email est déjà utilisée');
    }
    return true;
     }}),
  body('pseudo').custom(async (value, { req }) => {
    /** const test = mongodb.findUsersByPseudo(value);
     * 
      if (! test.$isEmpty()) {
      throw new Error('Ce pseudo est déjà utilisé');
      }
      return true;
      }),
     * 
     *  
     * */
    const test = await mongoose.findUsersByPseudo(value);
   
    if (Object.keys(test).length > 0) {
      throw new Error('Ce pseudo est déjà utilisé');
    }
    return true;
  }),

  body('password').isLength({ min: 4 }).withMessage('Doit contenir au moins 4 caractères'),
  body('confirmationPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }),
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
      const hashPassword = await argon2.hash(req.body.password);
      //await mongodb.createUser(req.body.pseudo, req.body.email, hashPassword, 'admin')
      await mongoose.createUser(req.body.pseudo, req.body.email, hashPassword, 'admin')
      // Ancienne commande de rajout d'un utilisateur avec le storage : addUser(req.body.email, hashPassword);
      req.flash('success', 'Votre compte ' + req.body.email + ' a bien été créé !');
      // Sinon retour à l'accueil
      res.redirect('/login');
    }
});

module.exports = router;
