
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


class SkillService {
getAllSkills() {
     return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Kompentanse', (error, result) => {
        if (error) throw error;
        resolve(result)
      });
    });
 }
getSkill(skillid) {
       return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Kompentanse WHERE skillid=?',[skillid], (error, result) => {
          if (error) throw error;
          resolve(result)
        });
      });
    }
  checkUserSkill(userid, skillid, callback) {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM UserKomp WHERE userid = ? AND skillid = ?', [userid, skillid], (error, result) => {
          if (error) throw error;
          resolve(result[0])
      });
    });
  }
addSkills(newSkills, userid) {
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO UserKomp (userid, skillid) values (?,?)', [userid, newSkills], (error, result) => {
        if(error) throw error;
        resolve();
      });
    });
  }

  addSkillswithDate(newSkills, userid, date) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO UserKomp (userid, skillid, validTo) values (?,?,?)', [userid, newSkills, date], (error, result) => {
          if(error) throw error;
          resolve();
        });
      });
    }
getYourSkills(userid) {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Kompentanse, UserKomp WHERE UserKomp.skillid = Kompentanse.skillid AND UserKomp.userid = ?', [userid], (error, result) => {
          if (error) throw error;
          resolve(result)
      });
    });
  }
getSkillInfo(skillid) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Kompentanse WHERE skillid = ?', [skillid], (error, result) => {
        if(error) throw error;
        resolve(result[0])
      });
    });
  }
deleteSkill(userid, skillid) {
  return new Promise ((resolve, reject) => {
    connection.query('DELETE FROM UserKomp WHERE userid=? AND skillid=?', [userid, skillid], (error, result) => {
      if(error) throw error;
      resolve()

    })
  })

}
checkSkillValid() {
  let today= new Date()
  return new Promise ((resolve, reject) => {
    connection.query('DELETE FROM UserKomp WHERE validTo < ?', [today], (error, result) => {
      if(error) throw error;
      resolve()

    })
  })
}
}
let skillService=new SkillService()
export {skillService}
