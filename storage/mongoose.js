
/**
 * Même chose que dans MongoDB.js mais avec Mongoose
 * 
 */




const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Users').then(() => {
console.log('Connected to MongoDB');
}).catch((err) => {
console.log('Error connecting to MongoDB:', err);
});


const uuid = require('uuid')
const mongouseModel = require('../models/userModel')
const User = mongouseModel.User;



// Fonction récupérant tous les utilisateurs
exports.findAllUsers= async function() {
    try{
        const data = await User.find();
        return data
        } catch(error){
        console.log(error)
    }
    
    
}


// Fonction récupérant tous les utilisateurs par leur pseudo
exports.findUsersByPseudo =  async function(pseudonyme){
    try{
    console.log(pseudonyme)
    let data = await User.find({pseudo:pseudonyme });
    return data;}
    catch (error) {
        //throw new Error("Chaine de caractères vide")
    }
}


// Fonction récupérant tous les utilisateurs par leur email
exports.findUsersByEmail =  async function(adresseMail){
    try{
    let data = await User.find({email:adresseMail});
    return data;}
    catch (error) {
        //throw new Error("Chaine de caractères vide")
    }
}

// Fonction récupérant un utilisateur par son email
exports.findOneUserByEmail =  async function(adresseMail){
    try{
    let data = await User.findOne({email:adresseMail});
    console.log("data : " + data);
    return data;
    } catch (error) {
        throw new Error("Utilisateur non trouvé")
    }
}

// Fonction créant un utilisateur 
exports.createUser =  async function(pseudonyme, email, password, role){

    try{
        console.log("test1")
        const user = new User({uuid: uuid.v4(), pseudo: pseudonyme, email: email, password: password, role:role})
        console.log(user)
        await user.save()
        console.log("creation réussie")
        } catch(error){
        console.log("Echec de la création de l'utilisateur")
    }
  
}

// fonction effaçant un utilisateur par son email
async function deleteUserByEmail(email){
   
   await User.findOneAndDelete({email : email})
   console.log("suppression réussie")
}

