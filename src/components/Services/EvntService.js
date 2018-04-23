
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

class EvntService {
  addEvnt(title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO Arrangement (title, description, meetingLocation, contactPerson, showTime, start, end, gearList) values (?, ?, ?, ?, ?, ?, ?, ?)', [title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList], (error, result) => {
          if (error) throw error;
          else
          resolve();
      });
    });
  }
  getLastEvnt() {
           return new Promise ((resolve, reject) => {
            connection.query('SELECT * FROM Arrangement ORDER BY ID DESC LIMIT 1 ', (error, result) => {
              if (error) throw error;
                resolve(result[0])
          });
        });
    }

    //funkjson for å endre bruker//henter det siste arrangementet lagt til i databasen
  getEvntInfo(id) {
        return new Promise ((resolve, reject) => {
         connection.query('SELECT * FROM Arrangement WHERE id=?', [id], (error, result) => {
           if (error) throw error;
             resolve(result[0])
           });
         });
      }
  changeEvnt(title, meetingLocation, description, contactPerson, gearList, show, start, end, eventId) {
    return new Promise ((resolve, reject) => {
     connection.query('UPDATE Arrangement SET title =?, meetingLocation=?, description=?, contactPerson=?, gearList=?, showTime=?, start=?, end=? WHERE id=?', [title, meetingLocation, description, contactPerson, gearList, show, start, end, eventId], (error, result) => {
       if (error) throw error;
         resolve(result)
       });
     });
  }
  getAllEvnts() {
     return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Arrangement', (error, result) => {
        if (error) throw error;
          resolve(result)
      });
    });
  }
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
