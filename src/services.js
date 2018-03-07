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


  getUsers(id, callback) {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  addUser(firstName, lastName, city, address, postalNumber, phone, email, username, password, callback) {
    connection.query('INSERT INTO Users (firstName, lastName, city, address, postalNumber, phone, email, userName, password) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, city, address, postalNumber, phone, email, username, password], (error, result) => {
      if (error) throw error;
      else console.log("Registration complete")
      callback();
    });
  }

  changeUser(firstName, lastName, city, id, callback) {
    connection.query('UPDATE Users SET firstName=?, lastName=?, city=? WHERE id=?', [firstName, lastName, city, id], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
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
  resetPassword(username, email, callback) {
    let newpassword = Math.random().toString(36).slice(-8);

    connection.query('SELECT id FROM Users WHERE (userName = ? AND email = ?)', [username, email], (error, result) => {
      if (error) throw error;
      console.log(result[0]);
      callback(result[0]);
      if(result[0] != null ) {

    connection.query('UPDATE Users SET password=? WHERE (userName = ? AND email = ?)', [newpassword, username, email], (error, result) => {
      if (error) throw error;
      console.log(email)
      console.log(result)
      let subject = "New password for " + username;
      let textmail = "Your new password: " + newpassword;
      mailService.sendMail(email, subject, textmail);
      });
    }
    else {
      alert("feil brukernavn eller epost");
    }

    });
  };

  unConfirmedUsers(callback) {
      connection.query('SELECT id, firstName, lastName, phone, email FROM Users WHERE confirmed=?', [false], (error, result) => {
        if (error) throw error;
        console.log(result);
        callback(result);
      });
    }
    confirmUser(id, callback) {
      connection.query('UPDATE Users SET confirmed=? WHERE id=?', [true, id], (error, result) => {
        if(error) throw error;
        console.log(result);
        callback(result);
      })
    }
//concat slår sammen kolonner

}

let userService = new UserService();
export { userService };
