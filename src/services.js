
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
getUsers(id, callback): Promise<user[]> {
    return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;
     console.log(result)
      resolve(result[0]);
    });
  });
}
getAllUsers(callback) {
    return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Users WHERE admin=0 ORDER BY vaktpoeng', (error, result) => {
      if (error) throw error;
      resolve(result);
    });
  });
}
getUserName(id, callback) {
  return new Promise ((resolve, reject) => {
  connection.query('SELECT firstName,lastName FROM Users WHERE id=?', [id], (error, result) => {
    if (error) throw error;
    resolve(result[0]);
  });
});
}
  //funksjon for å legge til bruker i databasen
addUser(firstName, lastName, address, postnr, poststed, phone, email, username, password,): Promise <user[]> {
    return new Promise ((resolve, reject) => {
    connection.query('INSERT INTO Users (firstName, lastName, address, postnr, poststed, phone, email, userName, password) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, address, postnr, poststed, phone, email, username, password], (error, result) => {
      if (error) throw error;
      else console.log("Registration complete")
      resolve();
    });
  });
  }
deactivateUser(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('UPDATE Users SET confirmed=? WHERE id=?', [false, userid], (error, result) => {
      if (error) throw error;
      resolve();
    })
  })
}

addArrangement(title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList): Promise {
    return new Promise ((resolve, reject) => {
      connection.query('INSERT INTO Arrangement (title, description, meetingLocation, contactPerson, showTime, start, end, gearList) values (?, ?, ?, ?, ?, ?, ?, ?)', [title, description, meetingLocation, contactPerson, showTime, startTime, endTime, gearList], (error, result) => {
        if (error) throw error;
        else
        resolve();
      });
    });
  }

  getRole() {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role', (error, result) => {
        if(error) throw error;
        resolve(result);
      });
    });
  }

getArrangement() {
     return new Promise ((resolve, reject) => {
      connection.query('SELECT id, title, description, meetingLocation, contactPerson, showTime, start, end, gearList FROM Arrangement', [false], (error, result) => {
        if (error) throw error;
        console.log(result);

          resolve(result)
      });
    });
    }
getLastArrangement() {
         return new Promise ((resolve, reject) => {
          connection.query('SELECT * FROM Arrangement ORDER BY ID DESC LIMIT 1 ', (error, result) => {
            if (error) throw error;
            console.log(result);

              resolve(result[0])
        });
      });
  }

  //funkjson for å endre bruker
changeUser(firstName, lastName, address, postalNumber, poststed, phone, email, id): Promise<user[]> {
    return new Promise ((resolve, reject) => {
   connection.query('UPDATE Users SET firstName=?, lastName=?, address=?, postnr=?, poststed=?, phone=?, email=? WHERE id=?', [firstName, lastName, address, postalNumber, poststed, phone, email, id], (error, result) => {
     if (error) throw error;

    resolve(result);
      });
    });
  }

changePassword(password, id): Promise<user[]> {
    return new Promise ((resolve, reject) => {
    connection.query('UPDATE Users SET password=? WHERE id=?', [password, id], (error, result) => {
      if (error) throw error;
      console.log("endring fullført")
      resolve(result);
        });
      });
    }
  // funkjson for å matche login verdier med bruker i databasen
loginUser(username, password, callback): Promise<void> {
    return new Promise ((resolve, reject) => {

    connection.query('SELECT * FROM Users WHERE (userName =? AND password=?)', [username, password], (error, result) => {

      if (error) throw error;

      console.log(result[0]);
      localStorage.setItem('signedInUser', JSON.stringify(result[0]));
      resolve(result[0]);
        });

      });

  }
signOut() {
     localStorage.clear();
  }

getSignedInUser() {
     let item = localStorage.getItem('signedInUser'); // Get User-object from browser
     if(!item) return null;

     return JSON.parse(item);
   }

getPoststed(postnr, callback): Promise<user[]> {
    return new Promise ((resolve, reject) => {
    connection.query('SELECT poststed FROM poststed WHERE postnr=?', [postnr], (error, result) => {
      if (error) throw error;
      console.log(result)
      resolve(result)
        });
      });
    }

  //funksjon for å endre passord og sende mail med det nye passordet.
resetPassword(username, email, callback): Promise<user[]> {
    return new Promise ((resolve, reject) => {
    //oppretter random nytt passord
    let newpassword = Math.random().toString(36).slice(-8);
    //henter id til bruker som matcher username og email med det som ble skrevet inn i apllikasjonen
    connection.query('SELECT id FROM Users WHERE (userName = ? AND email = ?)', [username, email], (error, result) => {
      if (error) throw error;
      console.log(result[0]);
      resolve(result[0]);
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
      });
    };
// funksjon for å hente alle brukere som har comfirmed = 0(false) i databsen
unConfirmedUsers(callback) {
     return new Promise ((resolve, reject) => {
      connection.query('SELECT id, firstName, lastName, phone, email FROM Users WHERE confirmed=?', [false], (error, result) => {
        if (error) throw error;
        console.log(result);

          resolve(result)
      });
    });
    }
    //funksjon for å sette confirmed=1(true) i databasen

confirmUser(id, callback): Promise<user[]> {
      return new Promise ((resolve, reject) => {
      connection.query('UPDATE Users SET confirmed=? WHERE id=?', [true, id], (error, result) => {
        if(error) throw error;
        console.log(result);
        resolve(result);
      })
    });
  }

confirmInteressed(arrangementId, userId) {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE Interessert SET interessed ="0" WHERE arrangementId=? AND userId=?', [arrangementId, userId], (error, result) => {
          if(error) throw error;
          resolve(result);
        })
      });
    }

getInteressed(arrangementId, userId, interessed) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO Interessert(arrangementId, userId, interessed) VALUES (?, ?, 1)', [arrangementId, userId, interessed], (error, result) => {
          if (error) throw error;
          console.log(result)
          resolve(result)
        });
      });
    }
checkIfInteressed(userId, arrangementId) {
          return new Promise ((resolve, reject) => {
          connection.query('SELECT userId, arrangementId FROM Interessert WHERE userId=? AND arrangementId=? ', [userId, arrangementId], (error, result) => {
            if(error) throw error;
            resolve(result);
          })
        });
        }
interessedUsers(userId, arrangementId,firstName,lastName, title) {
      return new Promise ((resolve, reject) => {
      connection.query('SELECT Interessert.userId, Interessert.arrangementId, firstname, lastName, title FROM Users, Arrangement, Interessert WHERE Users.id=Interessert.userId AND Arrangement.id=Interessert.arrangementId', [userId, arrangementId,firstName, lastName, title], (error, result) => {
        if(error) throw error;
        console.log(result);
        resolve(result);
      })
    });
    }
getInteressedUsers(arrangementId){
      return new Promise ((resolve, reject) => {
         connection.query('SELECT Interessert.userId, Interessert.arrangementId, Users.firstname, Users.lastName, Arrangement.title FROM Users, Arrangement, Interessert WHERE Users.id=Interessert.userId AND Arrangement.id=Interessert.arrangementId AND Interessert.arrangementId=? ORDER BY Users.vaktpoeng DESC', [arrangementId],(error, result) => {
          if(error) throw error;
          resolve(result);
         })
       });
     }

userList(callback) {
      return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Users WHERE confirmed =? AND admin=?', [true, false], (error, result) => {
        if (error) throw error;
        console.log(result);
        resolve(result);
      })
    });
  }

searchList(input, callback) {
      return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Users Where confirmed=? AND admin=? AND firstName LIKE ? order by firstName', [true, false, '%' + input + '%'], (error, result) => {
        if(error) throw error;
        console.log(result);
        resolve(result);
      })
    });
  }
getAllArrangement() {
       return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Arrangement', (error, result) => {
          if (error) throw error;


            resolve(result)
        });
      });
    }

getArrangementInfo(id) {
      return new Promise ((resolve, reject) => {
       connection.query('SELECT * FROM Arrangement WHERE id=?', [id], (error, result) => {
         if (error) throw error;


           resolve(result[0])
         });
       });
    }

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

getYourSkills(userid, callback) {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Kompentanse, UserKomp WHERE UserKomp.skillid = Kompentanse.skillid AND UserKomp.userid = ?', [userid], (error, result) => {
          if (error) throw error;

          resolve(result)
      });
    });
  }

getSkillInfo(skillid, callback) {
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
      console.log(result)
    })
  })

}
getVaktmal(callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Vaktmal', (error, result) => {
      if(error) throw error;
      resolve(result)
    })
  })
}

getRolewithUserInfo(arrid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM ((ArrangementRoller INNER JOIN Users ON ArrangementRoller.userid = Users.id) INNER JOIN Role ON ArrangementRoller.roleid = Role.roleid ) WHERE ArrangementRoller.arrid = ? ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
      if(error) throw error;
      resolve(result)

    })
  })
}

getThisVaktmal(vaktmalid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Vaktmal WHERE vaktmalid=? ', [vaktmalid], (error, result) => {
      if(error) throw error;
      resolve(result[0])
    })
  })
}
getRolesForMal(vaktmalid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Role, RoleVaktmal WHERE RoleVaktmal.roleid = Role.roleid AND RoleVaktmal.vaktmalid = ?', [vaktmalid], (error, result) => {
      if(error) throw error;
      resolve(result)
    })
  })
}

getAllRoles() {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role', (error, result) => {
        if (error) throw error;
        resolve(result);
    });
  });
  }
UpsertRoleForArrangement(userId, arr_roleId) {
    connection.query('UPDATE ArrangementRoller SET userid=? WHERE arr_rolleid=?', [userId, arr_roleId], (error, result) => {
      if(error) throw error;
      console.log("RESULTAT DÆ SHJØØØEEE: " + result);
    })
}

getRolesForArr(arrid, callback) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
        if(error) throw error;
        resolve(result)
    })
  })
}
getRolesWithNoUser(arrid, callback) {
    return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Role, ArrangementRoller WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.arrid = ? AND ArrangementRoller.userid IS NULL ORDER BY ArrangementRoller.roleid', [arrid], (error, result) => {
        if(error) throw error;
        resolve(result)
    })
  })
}
getRoleInfo(roleid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT title FROM Role WHERE roleid=?',[roleid], (error, result) => {
      if (error) throw error;
      resolve(result[0]);
  });
});
}
addRolesforArr(arrid, roleid, vaktmalid) {
  return new Promise ((resolve, reject) => {
    connection.query('INSERT INTO ArrangementRoller (arrid, roleid, vaktmalid) values (?,?,?)', [arrid, roleid, vaktmalid], (error, result) => {
      if(error) throw error;
      resolve()
      console.log(result)
    })
  })
}
addRolesforArrSingle(arrid, roleid) {
  return new Promise ((resolve, reject) => {
    connection.query('INSERT INTO ArrangementRoller (arrid, roleid) values (?,?)', [arrid, roleid], (error, result) => {
      if(error) throw error;
      resolve()
      console.log(result)
    })
  })
}
deleteRolesfromArr(arrid, roleid){
  return new Promise ((resolve, reject) => {
    connection.query('DELETE FROM ArrangementRoller WHERE arrid=? AND roleid=? LIMIT 1', [arrid, roleid], (error, result) => {
      if(error) throw error;
      resolve()
      console.log(result)
    })
  })
}
getRoleCount(arrid, roleid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT COUNT(roleid) as total FROM ArrangementRoller WHERE arrid=? AND roleid=?', [arrid, roleid], (error, result) => {
      if(error) throw error;

      resolve(result[0].total);
    })
  })
}
getRoleKomp(roleid, arrRolleid, callback) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM RoleKomp, ArrangementRoller WHERE RoleKomp.roleid = ArrangementRoller.roleid AND RoleKomp.roleid=? AND ArrangementRoller.arr_rolleid=? ORDER BY ArrangementRoller.roleid', [roleid, arrRolleid], (error, result) => {
      if(error) throw error;

      resolve(result);
    })
  })
}
getUserRoleKomp(roleid, arrid, userid, arrRoleid, callback) {
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
getUsedUsers(arr_rolleid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT userid FROM ArrangementRoller WHERE arr_rolleid=? AND userid IS NOT NULL', [arr_rolleid], (error, result) => {
      if(error) throw error;

      resolve(result[0]);
    })
  })
}
getUsedEventRoles(arrid, arr_rolleid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT arr_rolleid FROM ArrangementRoller WHERE arrid=? AND userid IS NOT NULL AND arr_rolleid =?', [arrid, arr_rolleid], (error, result) => {
      if(error) throw error;

      resolve(result[0]);
      })
    })
}
getWatchList(arrid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT Role.title, firstname, Arrangement.id FROM Role, Users, ArrangementRoller, Arrangement WHERE Role.roleid=ArrangementRoller.roleid AND Users.id=ArrangementRoller.userid AND Arrangement.id=ArrangementRoller.arrid AND ArrangementRoller.arrid=?', [arrid], (error, result) => {
      if(error) throw error;

      resolve(result);
    })
  })
}

userPassive(passive_start, passive_slutt, userid) {
  return new Promise ((resolve, reject) => {
    connection.query('INSERT INTO UserPassive (passive_start, passive_slutt, userid) VALUES (?,?,?) ', [passive_start, passive_slutt, userid], (error, result) => {
      if(error) throw error;

      resolve(result);
    })
  })
}
getUserPassive(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT passive_start, passive_slutt FROM UserPassive WHERE userid=?', [userid], (error, result) => {
      if(error) throw error;
     console.log(result)
      resolve(result);
    })
  })
}
getUserVaktListe(userid) {
  let today = new Date();
  return new Promise ((resolve, reject) => {

    connection.query('SELECT ArrangementRoller.arr_rolleid, Role.title as roleTitle, Arrangement.title as arrTitle, ArrangementRoller.godkjent, ArrangementRoller.tildelt_tid, Arrangement.start FROM Role, Arrangement, ArrangementRoller WHERE Role.roleid = ArrangementRoller.roleid AND Arrangement.id = ArrangementRoller.arrid AND ArrangementRoller.userid=? AND Arrangement.start >=? ORDER BY Arrangement.start ', [userid, today], (error, result) => {
      if(error) throw error;
     console.log(result)
      resolve(result);
    })
  })
}
godkjennVakt(arr_rolleid) {
  let today = new Date();
  return new Promise ((resolve, reject) => {
    connection.query('UPDATE ArrangementRoller SET godkjent=1, godkjent_tid=?  WHERE arr_rolleid=?', [today, arr_rolleid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
isUserPassive(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT passive_start, passive_slutt FROM UserPassive WHERE userid=?', [userid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}

}

let userService = new UserService();
export { userService };
