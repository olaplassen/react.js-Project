
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

 // Klasse for ulike eventer i programmet
class EvntService {
    // Funksjon for å legge til arrangement i databasen
  addEvnt(title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO Arrangement (title, description, meetingLocation, contactPerson, showTime, start, end, gearList) values (?, ?, ?, ?, ?, ?, ?, ?)', [title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList], (error, result) => {
          if (error) throw error;
          else
          resolve();
      });
    });
  }
    // Funksjon for å hente ut siste arrangement som ble lagt til i databasen.
  getLastEvnt() {
           return new Promise ((resolve, reject) => {
            connection.query('SELECT * FROM Arrangement ORDER BY ID DESC LIMIT 1 ', (error, result) => {
              if (error) throw error;
                resolve(result[0])
          });
        });
    }
    // Funkjson for å endre bruker.
    // Henter det siste arrangementet lagt til i databasen.
  getEvntInfo(id) {
        return new Promise ((resolve, reject) => {
         connection.query('SELECT * FROM Arrangement WHERE id=?', [id], (error, result) => {
           if (error) throw error;
             resolve(result[0])
           });
         });
      }
    // Funksjon som gjør det mulig å endre arrangement.
  changeEvnt(title, meetingLocation, description, contactPerson, gearList, show, start, end, eventId) {
    return new Promise ((resolve, reject) => {
     connection.query('UPDATE Arrangement SET title =?, meetingLocation=?, description=?, contactPerson=?, gearList=?, showTime=?, start=?, end=? WHERE id=?', [title, meetingLocation, description, contactPerson, gearList, show, start, end, eventId], (error, result) => {
       if (error) throw error;
         resolve(result)
       });
     });
  }
    // Henter ut alle arrangementene fra databasen.
  getAllEvnts() {
     return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Arrangement', (error, result) => {
        if (error) throw error;
          resolve(result)
      });
    });
  }
    // Henter ut arrangement som er fram i tid.
  getComingEvnts() {
    let today = new Date()
    return new Promise ((resolve, reject) => {
     connection.query('SELECT * FROM Arrangement WHERE Arrangement.start > ?',[today], (error, result) => {
       if (error) throw error;
         resolve(result)
     });
   });
  }
}

let evntService = new EvntService();
export {evntService}
