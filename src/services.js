
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

// Class that performs database queries related to customers
class UserService {

//USer funksjoner- USERSERVICE-----------------------------------------------------------------------------------
getUsers(id) {//henter en bruker
    return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;
      resolve(result[0]);
    });
  });
}
getUserByMail(recieverEmail) {
  return new Promise ((resolve, reject) => {
  connection.query('SELECT * FROM Users WHERE email=?', [recieverEmail], (error, result) => {
    if (error) throw error;
    resolve(result[0]);
    });
  });
}//henter bruker via mail
getAllUsers() {
    return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM Users WHERE admin=0 ORDER BY vaktpoeng', (error, result) => {
      if (error) throw error;
      resolve(result);
    });
  });
}//henter alle brukere i databasen
getUserName(id) {
  return new Promise ((resolve, reject) => {
  connection.query('SELECT firstName,lastName FROM Users WHERE id=?', [id], (error, result) => {
    if (error) throw error;
    resolve(result[0]);
    });
  });
}//SJEKK
addUser(firstName, lastName, address, postnr, poststed, phone, email, username, password) {//legger til bruker
    return new Promise ((resolve, reject) => {
    var hashedPassword = passwordHash.generate(password); //krypterer passord bruker har skrevet inn
    connection.query('INSERT INTO Users (firstName, lastName, address, postnr, poststed, phone, email, userName, password) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, address, postnr, poststed, phone, email, username,hashedPassword], (error, result) => {
      if (error) throw error;
      console.log(result)
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
}//setter godkjen=false
loginUser(username, inputpassword) {//login for admin og bruker
    return new Promise ((resolve, reject) => {

    connection.query('SELECT * FROM Users WHERE (userName =?)', [username], (error, result) => {
      let hashedPassword = result[0].password;  //variabel for kryptert passord fra databasen
      let correctpassword = passwordHash.verify(inputpassword, hashedPassword); //Sjekker att input verdi stemmer overens med det krypterte passordet

      if (error) throw error;
      localStorage.setItem('passwordResult', JSON.stringify(correctpassword)); //lagrer boolean verdi for om passordet stemmet eller ikke i localStorage
      localStorage.setItem('signedInUser', JSON.stringify(result[0]));//lagrer bruker i localStorage
      resolve(result[0]);

      });
      });

  }
getSignedInUser() { //henter item lagret i localStorage
     let item = localStorage.getItem('signedInUser'); // Get User-object from browser
     if(!item) return null;

     return JSON.parse(item);
   }
unConfirmedUsers() { //liste over akke ubekreftede/deaktiverte brukere
 return new Promise ((resolve, reject) => {
   connection.query('SELECT id, firstName, lastName, phone, email FROM Users WHERE confirmed=?', [false], (error, result) => {
   if (error) throw error;
     resolve(result)
   });
 });
}
confirmUser(id) {//godkjennetr bruker ved å sette godkjenn=true
      return new Promise ((resolve, reject) => {
      connection.query('UPDATE Users SET confirmed=? WHERE id=?', [true, id], (error, result) => {
        if(error) throw error;

        resolve(result);
      })
    });
  }
userList(callback) {//henter alle brukere som er godkjent og ikke er admin for søke funksjon
      return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Users WHERE confirmed =? AND admin=?', [true, false], (error, result) => {
        if (error) throw error;

        resolve(result);
      })
    });
  }
changePassword(password, id) {//endre passord for bruker
    return new Promise ((resolve, reject) => {
    let hashedPassword = passwordHash.generate(password); //krypterer verdi fra funksjon
    connection.query('UPDATE Users SET password=? WHERE id=?', [hashedPassword, id], (error, result) => {
      if (error) throw error;
      console.log("endring fullført")
      resolve(result);
        });
      });
    }
  // funkjson for å matche login verdier med bruker i databasen
signOut() {
     localStorage.clear();
  } // sletter localstorage
changeUser(firstName, lastName, address, postalNumber, poststed, phone, email, id){
    return new Promise ((resolve, reject) => {
   connection.query('UPDATE Users SET firstName=?, lastName=?, address=?, postnr=?, poststed=?, phone=?, email=? WHERE id=?', [firstName, lastName, address, postalNumber, poststed, phone, email, id], (error, result) => {
     if (error) throw error;

    resolve(result);
      });
    });
  }//endre brukerinformasjon
getPoststed(postnr) {
    return new Promise ((resolve, reject) => {
    connection.query('SELECT poststed FROM poststed WHERE postnr=?', [postnr], (error, result) => {
      if (error) throw error;
      resolve(result)
        });
      });
    }
resetPassword(username, email) {//forespørsel om nytt passord
    return new Promise ((resolve, reject) => {
    //oppretter random nytt passord
    let newpassword = Math.random().toString(36).slice(-8);
    let hashedPassword = passwordHash.generate(newpassword); //krypterer nytt passord
    //henter id til bruker som matcher username og email med det som ble skrevet inn i apllikasjonen
    connection.query('SELECT id FROM Users WHERE (userName = ? AND email = ?)', [username, email], (error, result) => {
      if (error) throw error;

      resolve(result[0]);
      //hvis resultatet av spørringen ikke er null skal passordet oppdateres
      if(result[0] != null ) {

    connection.query('UPDATE Users SET password=? WHERE (userName = ? AND email = ?)', [hashedPassword, username, email], (error, result) => {
      if (error) throw error;

      let subject = "New password for " + username;
      let textmail = "Your new password: " + newpassword;
      //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
      mailService.sendMail(email, subject, textmail);
      });
      }
    });
  });
};

//EventRole funksjoner -------------------------------------------------------------------------------------------------------
addShiftChange(original_userid, toChange_userid, arr_rolleid) {
  return new Promise ((resolve, reject) => {
    connection.query('INSERT INTO VaktBytte (original_userid, change_userid, arr_rolleid) VALUES (?,?,?) ', [original_userid, toChange_userid, arr_rolleid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
getShiftChangeInfo() {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT vaktbytteid, ArrangementRoller.arrid, a.id AS newUserid, b.id AS oldUserid, a.firstName AS newfirstName, a.lastName AS newlastName, b.firstName AS oldfirstName, b.lastName AS oldlastName, Arrangement.title, ArrangementRoller.arr_rolleid FROM Users a, Users b, ArrangementRoller, VaktBytte, Arrangement WHERE VaktBytte.change_userid = a.id AND VaktBytte.original_userid = b.id AND ArrangementRoller.arr_rolleid = VaktBytte.arr_rolleid AND ArrangementRoller.arrid = Arrangement.id AND godkjent_bytte = 0', (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
godkjennBytte(newuserid, arr_rolleid, tildelt_tid) {
  return new Promise ((resolve, reject) => {
    connection.query('UPDATE ArrangementRoller SET userid=?, tildelt_tid=?  WHERE arr_rolleid=?', [newuserid, tildelt_tid, arr_rolleid,], (error, result) => {
      connection.query('UPDATE VaktBytte SET godkjent_bytte=1'), (error, result) => {
        if(error) throw error;
        resolve(result)
      }
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
getComingVaktListe(userid) {
  let today = new Date();
  return new Promise ((resolve, reject) => {

    connection.query('SELECT ArrangementRoller.arr_rolleid, Role.title as roleTitle, Arrangement.title as arrTitle, ArrangementRoller.godkjent, ArrangementRoller.tildelt_tid, Arrangement.start FROM Role, Arrangement, ArrangementRoller WHERE Role.roleid = ArrangementRoller.roleid AND Arrangement.id = ArrangementRoller.arrid AND ArrangementRoller.userid=? AND Arrangement.start >=? ORDER BY Arrangement.start ', [userid, today], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
getDoneVaktListe(userid) {
  let today = new Date();
  return new Promise ((resolve, reject) => {

    connection.query('SELECT ArrangementRoller.arr_rolleid, Role.title as roleTitle, Arrangement.title as arrTitle, ArrangementRoller.godkjent, ArrangementRoller.tildelt_tid, Arrangement.start FROM Role, Arrangement, ArrangementRoller WHERE Role.roleid = ArrangementRoller.roleid AND Arrangement.id = ArrangementRoller.arrid AND ArrangementRoller.userid=? AND Arrangement.start <=? ORDER BY Arrangement.start ', [userid, today], (error, result) => {
      if(error) throw error;
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
getArrRolleInfo(arr_rolleid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM ArrangementRoller WHERE arr_rolleid=?', [arr_rolleid], (error, result) => {
      if(error) throw error;
      resolve(result[0]);

    })
  })
}

//Div funksjoner ----------------------------------------------------------------------------------------------------------
searchList(input) {
      return new Promise ((resolve, reject) => {
      connection.query('SELECT * FROM Users Where confirmed=? AND admin=? AND CONCAT(firstName, " ", lastName) LIKE "%"?"%" OR CONCAT(lastName, " ", firstName) LIKE "%"?"%" order by id', [true, false, input, input], (error, result) => {
        if(error) throw error;

        resolve(result);
      })
    });
  }
shiftInfo2mnd() {
  let toMnd = new Date();
  toMnd.setMonth(toMnd.getMonth() - 2)

  return new Promise ((resolve, reject) => {
    connection.query('SELECT COUNT(ArrangementRoller.arr_rolleid) as roleCount, Users.id, Users.firstName, Users.lastName, Users.vaktpoeng FROM Users, ArrangementRoller, Arrangement WHERE ArrangementRoller.userid = Users.id AND Arrangement.id = ArrangementRoller.arrid AND Arrangement.end > ? GROUP BY Users.id', [toMnd], (error, result) => {
      if(error) throw error;
      resolve(result);

    })
  })
}
shiftInfo2mndSearch(input) {
  let toMnd = new Date();
  toMnd.setMonth(toMnd.getMonth() - 2)

  return new Promise ((resolve, reject) => {
    connection.query('SELECT COUNT(ArrangementRoller.arr_rolleid) as roleCount, Users.id, Users.firstName, Users.lastName, Users.vaktpoeng FROM Users, ArrangementRoller, Arrangement WHERE ArrangementRoller.userid = Users.id AND Arrangement.id = ArrangementRoller.arrid AND Arrangement.end > ? AND Users.firstName LIKE ? GROUP BY Users.id', [toMnd, '%' + input + '%'], (error, result) => {
      if(error) throw error;
      resolve(result);

    })
  })
}
participatedRoles(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT COUNT(ArrangementRoller.roleid) as deltattRolle, Role.title, Role.roleid FROM ArrangementRoller, Role WHERE ArrangementRoller.roleid = Role.roleid AND ArrangementRoller.userid=? GROUP BY Role.roleid', [userid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
getUserShiftInfoBetween(userid, start, end) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT COUNT(ArrangementRoller.arr_rolleid) as antVakter, SUM(TIMESTAMPDIFF(hour, Arrangement.start, Arrangement.end)) timer FROM ArrangementRoller, Arrangement WHERE ArrangementRoller.arrid = Arrangement.id AND ArrangementRoller.userid = ? AND Arrangement.end > ? AND Arrangement.end < ? GROUP BY ArrangementRoller.userid', [userid, start, end], (error, result) => {
      if(error) throw error;
      resolve(result[0]);
    })
  })
}
addPoints(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('UPDATE Users SET vaktpoeng = vaktpoeng + 1 WHERE id=?', [userid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}
removePoints(userid) {
  return new Promise ((resolve, reject) => {
    connection.query('UPDATE Users SET vaktpoeng = vaktpoeng - 1 WHERE id=?', [userid], (error, result) => {
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
      resolve(result);
      })
    })
  }
isUserPassive(userid, arrid) {
  return new Promise ((resolve, reject) => {
    connection.query('SELECT * FROM UserPassive, Arrangement WHERE UserPassive.passive_start <= Arrangement.end AND UserPassive.passive_slutt >= Arrangement.start AND UserPassive.userid=? AND Arrangement.id=?', [userid, arrid], (error, result) => {
      if(error) throw error;
      resolve(result);
    })
  })
}

}
let userService = new UserService();
export { userService };


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

//Skill funksjoner -------------------------------------------------------------------------------------------

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

class InterestService {
getInteressed(arrangementId, userId) {
      return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO Interessert(arrangementId, userId) VALUES (?, ?)', [arrangementId, userId], (error, result) => {
          if (error) throw error;
          console.log(result)
          resolve(result)
        });
      });
    }
removeInterested(userid, arrid) {
  return new Promise ((resolve, reject) => {
    connection.query('DELETE FROM Interessert WHERE userId=? AND arrangementid=?', [userid, arrid], (error, result) => {
      if(error) throw error;
      resolve()
    })
  });
}
getInteressedUsers(arrangementId){
      return new Promise ((resolve, reject) => {
         connection.query('SELECT Interessert.userId, Interessert.arrangementId, Users.firstname, Users.lastName, Users.vaktpoeng, Users.email, Arrangement.title FROM Users, Arrangement, Interessert WHERE Users.id=Interessert.userId AND Arrangement.id=Interessert.arrangementId AND Interessert.arrangementId=? ORDER BY Users.vaktpoeng DESC', [arrangementId],(error, result) => {
          if(error) throw error;
          console.log(result)
          resolve(result);
         })
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

}
let interestService=new InterestService()
export {interestService}


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
