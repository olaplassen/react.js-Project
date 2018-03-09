import mysql from 'mysql';
import { mailService } from './mailservices';

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

// Class that performs database queries related to customers
class UserService {

  //funkjson for å hente ut all informasjon til en bruker ved hjelp av id
  getUsers(id, callback) {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  //funksjon for å legge til bruker i databasen
  addUser(firstName, lastName, city, address, postalNumber, phone, email, username, password, callback) {
    connection.query('INSERT INTO Users (firstName, lastName, city, address, postalNumber, phone, email, userName, password) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, city, address, postalNumber, phone, email, username, password], (error, result) => {
      if (error) throw error;
      else console.log("Registration complete")
      callback();
    });
  }
  //funkjson for å endre bruker
  changeUser(firstName, lastName, address, city, postalNumber, phone, email, id, callback) {
   connection.query('UPDATE Users SET firstName=?, lastName=?, address=?, city=?, postalNumber=?, phone=?, email=? WHERE id=?', [firstName, lastName, address, city, postalNumber, phone, email, id], (error, result) => {
     if (error) throw error;

     callback(result);
   });
 }
  // funkjson for å matche login verdier med bruker i databasen
  loginUser(username, password, callback) {
    connection.query('SELECT * FROM Users WHERE (userName =? AND password=?)', [username, password], (error, result) => {
      if (error) throw error;

      console.log(result[0]);

      callback(result[0]);
    });
  }

  loginAdmin(username, password, callback) {
    connection.query('SELECT * FROM Admin WHERE (userName =? AND password=?)', [username, password], (error, result) => {
      if (error) throw error;

      console.log(result[0]);

      callback(result[0]);
    });
  }

  //funksjon for å endre passord og sende mail med det nye passordet.
  resetPassword(username, email, callback) {
    //oppretter random nytt passord
    let newpassword = Math.random().toString(36).slice(-8);
    //henter id til bruker som matcher username og email med det som ble skrevet inn i apllikasjonen
    connection.query('SELECT id FROM Users WHERE (userName = ? AND email = ?)', [username, email], (error, result) => {
      if (error) throw error;
      console.log(result[0]);
      callback(result[0]);
      //hvis resultatet av spørringen ikke er null skal passordet oppdateres
      if(result[0] != null ) {

    connection.query('UPDATE Users SET password=? WHERE (userName = ? AND email = ?)', [newpassword, username, email], (error, result) => {
      if (error) throw error;
      console.log(email)
      console.log(result)
      let subject = "New password for " + username;
      let textmail = "Your new password: " + newpassword;
      //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
      mailService.sendMail(email, subject, textmail);
      });
    }
    else {
      alert("feil brukernavn eller epost");
    }

    });
  };
  // funksjon for å hente alle brukere som har comfirmed = 0(false) i databsen
  unConfirmedUsers(callback) {
      connection.query('SELECT id, firstName, lastName, phone, email FROM Users WHERE confirmed=?', [false], (error, result) => {
        if (error) throw error;
        console.log(result);
        callback(result);
      });
    }
    //funksjon for å sette confirmed=1(true) i databasen
    confirmUser(id, callback) {
      connection.query('UPDATE Users SET confirmed=? WHERE id=?', [true, id], (error, result) => {
        if(error) throw error;
        console.log(result);
        callback(result);
      })
    }
    addEvent(name, ....) {
      connection.query('INSERT INTO Events (name, , , , , , , , ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [, , , , , , , , ], (error, result) => {
        if (error) throw error;
        else console.log("Event added")
        console.log(result);
        callback();
    })
  }
//concat slår sammen kolonner

}

let userService = new UserService();
export { userService };
