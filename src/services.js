import mysql from 'mysql';
import { mailService } from './mailservices';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'erlensm',
    password: 'e6vSqBQX',
    database: 'erlensm'
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

  changeUser(firstName, lastName, address, city, postalNumber, phone, email, id, callback) {
    connection.query('UPDATE Users SET firstName=?, lastName=?, address=?, city=?, postalNumber=?, phone=?, email=? WHERE id=?', [firstName, lastName, address, city, postalNumber, phone, email, id], (error, result) => {
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
  resetPassword(userName, email, callback) {
    let newpassword = Math.random().toString(36).slice(-8);
    connection.query('UPDATE Users SET password=? WHERE (userName = ? AND email = ?)', [newpassword, userName, email], (error, result) => {
      if (error) throw error;
      console.log("mail delivered")
      let subject = "New password for " + userName;
      let textmail = "Your new password: " + newpassword;
      mailService.sendMail(email, subject, textmail);


    });
  }

}


let userService = new UserService();

export { userService };
