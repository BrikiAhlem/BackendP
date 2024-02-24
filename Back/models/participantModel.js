// models/participantModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Nombre de rounds de salage pour bcrypt

const Participant = {
    register: (participantData, callback) => {
      // Hash du mot de passe avant de l'insérer dans la base de données
      bcrypt.hash(participantData.password, saltRounds, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
  
        db.query(
          'INSERT INTO user (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
          [
            participantData.nom,
            participantData.prenom,
            participantData.email,
            hashedPassword, // Utilisez le mot de passe haché
          ],
          (error, result) => {
            if (error) {
              return callback(error);
            }
            return callback(null, result);
          }
        );
      });
    },


  login: (email, password, callback) => {
    db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
      if (error) {
        return callback(error);
      }
      if (results.length > 0) {
        // Vérifier le mot de passe (utilisez bcrypt.compare dans un environnement de production)
        if (results[0].password === password) {
          return callback(null, results[0]);
        } else {
          return callback(null, null); // Mot de passe incorrect
        }
      } else {
        return callback(null, null); // Utilisateur non trouvé
      }
    });
  },
};

module.exports = Participant;
