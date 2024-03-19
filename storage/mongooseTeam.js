const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Users').then(() => {
console.log('Connected to MongoDB');
}).catch((err) => {
console.log('Error connecting to MongoDB:', err);
});


const uuid = require('uuid')
const mongouseModel = require('../models/teamModel')
const mongooseUser = require('./mongoose')
const Team = mongouseModel.Team;


// Fonction récupérant tous les utilisateurs
exports.findAllTeams= async function() {
    try{
        const data = await Team.find();
        return data
        } catch(error){
        console.log(error)
    }
}


// Fonction créant un utilisateur 
exports.createTeam =  async function(nom, membres){
   try{
        console.log("test1")
        const team = new Team({uuid: uuid.v4(), nom: nom})
    
        await addUsers(membres,team);        
        await team.save();
        
        } catch(error){
        console.log("Echec de la création de l'équipe")
    }
}


async function addUsers(membres, team){        
    try{
        for (let membre of membres) {
            const member = await mongooseUser.findOneUserByEmail(membre);
            team.membres.push(member);
        }
    } catch (error){
        console.log("error")
    }
}
    

