
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

class RoleService {
  getRoles() { // henter roller fra Role
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role', (error, result) => {
        if(error) throw error;
        resolve(result);
      });
    });
  }
  getVaktmal() { // henter vaktmal fra Vaktmal
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Vaktmal', (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  getRolesForMal(vaktmalid) { // henter roller for bestemt mal
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role, RoleVaktmal WHERE RoleVaktmal.roleid = Role.roleid AND RoleVaktmal.vaktmalid = ?', [vaktmalid], (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  getRolesForArr(arrid) { // henter roller for et bestemt arrangement
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? ORDER BY ArrangementRoller.roleid, ArrangementRoller.arr_rolleid DESC', [arrid], (error, result) => {
          if(error) throw error;
          resolve(result)
      })
    })
  }
  getRolesWithNoUser(arrid) { // henter roller som ikke er besatt av bruker
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? AND ArrangementRoller.userid IS NULL ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
          if(error) throw error;
          resolve(result)
      })
    })
  }
  addRolesforArr(arrid, roleid, vaktmalid) { // legger til roller for et bestemt arrangement med vaktmal
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO ArrangementRoller (arrid, roleid, vaktmalid) values (?,?,?)', [arrid, roleid, vaktmalid], (error, result) => {
        if(error) throw error;
        resolve()
      })
    })
  }
  addRolesforArrSingle(arrid, roleid) { //legger til bestemte roller for et bestemt arrangement
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO ArrangementRoller (arrid, roleid) values (?,?)', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  deleteRolesfromArr(arrid, roleid){ // fjerne roller for arrangement
    return new Promise ((resolve, reject) => {
      connection.query('DELETE FROM ArrangementRoller WHERE arrid=? AND roleid=? ORDER BY arr_rolleid DESC LIMIT 1', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve()
      })
    })
  }
  getRoleCount(arrid, roleid) {// henter antallet roller som trengs for et bestemt arrangement
    return new Promise ((resolve, reject) => {
      connection.query('SELECT COUNT(roleid) as total FROM ArrangementRoller WHERE arrid=? AND roleid=?', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve(result[0].total);
      })
    })
  }
  getRoleKomp(roleid, arrRolleid) {// henter hvilke kompetanser som trengs for hver enkelt rolle
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM RoleKomp, ArrangementRoller WHERE RoleKomp.roleid = ArrangementRoller.roleid AND RoleKomp.roleid=? AND ArrangementRoller.arr_rolleid=? ORDER BY ArrangementRoller.roleid', [roleid, arrRolleid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  getUserRoleKomp(roleid, arrid, userid, arrRoleid) { // sjekker hvilken roller brukere kan ha basert på kompetanse
    return new Promise ((resolve, reject) => {
      connection.query('SELECT UserKomp.skillid, UserKomp.userid, RoleKomp.roleid FROM UserKomp, RoleKomp, ArrangementRoller WHERE ArrangementRoller.roleid = RoleKomp.roleid AND UserKomp.skillid = RoleKomp.skillid AND ArrangementRoller.roleid = ? AND ArrangementRoller.arrid = ? AND UserKomp.userid = ? AND ArrangementRoller.arr_rolleid = ?', [roleid, arrid, userid, arrRoleid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  addUserForRole(userid, arr_roleid, arrid, tildeltTid) {// legger inn rolle til en bestemt bruker i et bestemt arrangement
    return new Promise ((resolve, reject) => {
      connection.query('UPDATE ArrangementRoller SET userid=?, tildelt_tid=?  WHERE arr_rolleid=? AND arrid=?', [userid, tildeltTid, arr_roleid, arrid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  getRolewithUserInfo(arrid) {// henter informasjon om brukeren og rollen i et bestemt arrangement
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM ((ArrangementRoller INNER JOIN Users ON ArrangementRoller.userid = Users.id) INNER JOIN Role ON ArrangementRoller.roleid = Role.roleid ) WHERE ArrangementRoller.arrid = ? ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
        if(error) throw error;
        resolve(result)

      })
    })
  }

}

let roleService = new RoleService();
export {roleService}
