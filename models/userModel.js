const mongoose = require('mongoose');



/***
 * Définition du Schéma et du Modèle
 */


const UserSchema = new mongoose.Schema({uuid : String, pseudo : String, email : String, password : String, role : String });
exports.User = mongoose.model('User', UserSchema);