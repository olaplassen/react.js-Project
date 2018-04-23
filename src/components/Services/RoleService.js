
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
  getRoles() {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role', (error, result) => {
        if(error) throw error;
        resolve(result);
      });
    });
  }
  getVaktmal() {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Vaktmal', (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  getRolesForMal(vaktmalid) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role, RoleVaktmal WHERE RoleVaktmal.roleid = Role.roleid AND RoleVaktmal.vaktmalid = ?', [vaktmalid], (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  getRolesForArr(arrid) {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? ORDER BY ArrangementRoller.roleid, ArrangementRoller.arr_rolleid DESC', [arrid], (error, result) => {
          if(error) throw error;
          resolve(result)
      })
    })
  }
  getRolesWithNoUser(arrid) {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? AND ArrangementRoller.userid IS NULL ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
          if(error) throw error;
          resolve(result)
      })
    })
  }
  addRolesforArr(arrid, roleid, vaktmalid) {
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO ArrangementRoller (arrid, roleid, vaktmalid) values (?,?,?)', [arrid, roleid, vaktmalid], (error, result) => {
        if(error) throw error;
        resolve()
      })
    })
  }
  addRolesforArrSingle(arrid, roleid) {
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO ArrangementRoller (arrid, roleid) values (?,?)', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve(result)
      })
    })
  }
  deleteRolesfromArr(arrid, roleid){
    return new Promise ((resolve, reject) => {
      connection.query('DELETE FROM ArrangementRoller WHERE arrid=? AND roleid=? ORDER BY arr_rolleid DESC LIMIT 1', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve()
      })
    })
  }
  getRoleCount(arrid, roleid) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT COUNT(roleid) as total FROM ArrangementRoller WHERE arrid=? AND roleid=?', [arrid, roleid], (error, result) => {
        if(error) throw error;
        resolve(result[0].total);
      })
    })
  }
  getRoleKomp(roleid, arrRolleid) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM RoleKomp, ArrangementRoller WHERE RoleKomp.roleid = ArrangementRoller.roleid AND RoleKomp.roleid=? AND ArrangementRoller.arr_rolleid=? ORDER BY ArrangementRoller.roleid', [roleid, arrRolleid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  getUserRoleKomp(roleid, arrid, userid, arrRoleid) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT UserKomp.skillid, UserKomp.userid, RoleKomp.roleid FROM UserKomp, RoleKomp, ArrangementRoller WHERE ArrangementRoller.roleid = RoleKomp.roleid AND UserKomp.skillid = RoleKomp.skillid AND ArrangementRoller.roleid = ? AND ArrangementRoller.arrid = ? AND UserKomp.userid = ? AND ArrangementRoller.arr_rolleid = ?', [roleid, arrid, userid, arrRoleid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  addUserForRole(userid, arr_roleid, arrid, tildeltTid) {
    return new Promise ((resolve, reject) => {
      connection.query('UPDATE ArrangementRoller SET userid=?, tildelt_tid=?  WHERE arr_rolleid=? AND arrid=?', [userid, tildeltTid, arr_roleid, arrid], (error, result) => {
        if(error) throw error;
        resolve(result);
      })
    })
  }
  getRolewithUserInfo(arrid) {
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
