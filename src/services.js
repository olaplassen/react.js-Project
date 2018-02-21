import mysql from 'mysql';

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
  getUsers(callback) {
    connection.query('SELECT * FROM Users', (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  getUsers(id, callback) {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  addUser(firstName, lastName, city, callback) {
    connection.query('INSERT INTO Users (firstName, lastName, city) values (?, ?)', [firstName, lastName, city], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  changeUser(firstName, lastName, city, id, callback) {
    connection.query('UPDATE Users SET firstName=?, lastName=?, city=? WHERE id=?', [firstName, lastName, city, id], (error, result) => {
      if (error) throw error;

      callback();
    })
  }

  // removeCustomer(id, callback) {
  //   connection.query('DELETE FROM Customers WHERE id=?', [id], (error, result) => {
  //     if (error) throw error;
  //
  //
  //   })
  // }

  checkLogin(username, password) {

  }
}

let UserService = new UserService();

export { userService };
