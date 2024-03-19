const mongoose = require('mongoose');

const mongouseModel = require('../models/userModel')
const User = mongouseModel.User;


/***
 * Définition du Schéma et du Modèle
 */


const TeamSchema = new mongoose.Schema({uuid : String, nom : String, membres : [{type: mongoose.SchemaTypes.ObjectId, ref:'User'} ] });
exports.Team = mongoose.model('Equipe', TeamSchema);

