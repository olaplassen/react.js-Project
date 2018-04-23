  // Importerer klasser inn i filen.
import mysql from 'mysql';
import { mailService } from './mailservices';
var passwordHash = require('password-hash')

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_22',
    password: 'YpmfXR8f',
    database: 'g_oops_22'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    console.log("Database is connected");
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

  // Klasse for å kategorisere interesser på arrangement av brukere.
class InterestService {
    // Gjør det mulig for brukere å melde sin interesse for et spesefikt arrangement
getInteressed(arrangementId, userId) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO Interessert(arrangementId, userId) VALUES (?, ?)', [arrangementId, userId], (error, result) => {
          if (error) throw error;

          resolve(result)
        });
      });
    }
    // Fjerner brukerer som er interesert i et arrangemnet.
removeInterested(userid, arrid) {
  return new Promise ((resolve, reject) => {
    connection.query('DELETE FROM Interessert WHERE userId=? AND arrangementid=?', [userid, arrid], (error, result) => {
      if(error) throw error;
      resolve()
    })
  });
}
  // Henter ut interesserte brukere for et spesefikt arrangement.
getInteressedUsers(arrangementId){
      return new Promise ((resolve, reject) => {
         connection.query('SELECT Interessert.userId, Interessert.arrangementId, Users.firstname, Users.lastName, Users.vaktpoeng, Users.email, Arrangement.title FROM Users, Arrangement, Interessert WHERE Users.id=Interessert.userId AND Arrangement.id=Interessert.arrangementId AND Interessert.arrangementId=? ORDER BY Users.vaktpoeng DESC', [arrangementId],(error, result) => {
          if(error) throw error;

          resolve(result);
         })
       });
     }
    // Sjekker om en bruker er interessert i et arrangement.
checkIfInteressed(userId, arrangementId) {
   return new Promise ((resolve, reject) => {
   connection.query('SELECT userId, arrangementId FROM Interessert WHERE userId=? AND arrangementId=? ', [userId, arrangementId], (error, result) => {
     if(error) throw error;
     resolve(result);
   })
 });
}

}

  // Eksporterer klassen så vi kan bruke funksjonaliteten i andre filer
let interestService = new InterestService()
export {interestService}
