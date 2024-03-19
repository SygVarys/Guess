


const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/Users';

const client = new MongoClient(uri);


// Fonction récupérant tous les utilisateurs
exports.findAllUsers= async function() {
    try{
        connection();
        let data= await client.db('Users').collection('users').find({}).toArray();
        console.log(JSON.stringify(data));
        client.close();
        return data
        } catch(error){
        console.log(error)
    }
    
    
}


// Fonction récupérant tous les utilisateurs par leur pseudo
exports.findUsersByPseudo =  async function(pseudonyme){
    try{
    connection()
    let data = await client.db('Users').collection('users').find({pseudo:pseudonyme }).toArray();
    client.close();
    return data;}
    catch (error) {
        //throw new Error("Chaine de caractères vide")
    }
}


// Fonction récupérant tous les utilisateurs par leur email
exports.findUsersByEmail =  async function(adresseMail){
    try{
    connection()
    let data = await client.db('Users').collection('users').find({email:adresseMail}).toArray();
    client.close();
    return data;}
    catch (error) {
        //throw new Error("Chaine de caractères vide")
    }
}

// Fonction récupérant un utilisateur par son email
exports.findOneUserByEmail =  async function(adresseMail){
    try{
    connection()
    let data = await client.db('Users').collection('users').findOne({email:adresseMail});
    client.close();
    return data;}
    catch (error) {
        throw new Error("Utilisateur non trouvé")
    }
}

// Fonction créant un utilisateur 
exports.createUser =  async function(pseudonyme, email, password, role){

    try{
        connection();
        await client.db('Users').collection('users').insertOne({pseudo : pseudonyme, email : email, password : password, role : role})
        console.log("creation réussie")
        client.close();
        } catch(error){
        console.log("Echec de la création de l'utilisateur")
    }
  
}

// fonction effaçant un utilisateur par son email
async function deleteUserByEmail(email){
   
   await client.db('Users').collection('users').deleteOne({email : email})
   console.log("suppression réussie")
}

async function connection() {
    try {
        // Connexion à la base
        await client.connect();
        console.log('Connexion réussie !');
        // Récupération de la base de données
        const db = client.db('users');

        // Récupération de la collection (équivalent d'une table) sur laquelle on souhaite travailler
        const collection = db.collection('cities');

        // Fermeture du client
    } catch (error) {
        console.log(error);
    }
}


