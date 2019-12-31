// Membuat basisdata footballDB
var dbPromised = idb.open('footballDB', 1, upgradeDb => {
  var teamObjectStore = upgradeDb.createObjectStore('teams', {
    keyPath: 'id'
  });
  teamObjectStore.createIndex('shortName', 'shortName', { unique: false });

  var matchObjectStore = upgradeDb.createObjectStore('matches', {
    keyPath: 'id'
  });
  matchObjectStore.createIndex('matchday', 'matchday', { unique: false });
});

function saveForLater(teams) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      console.log(teams);
      store.add(teams);
      return tx.complete;
    })
    .then(function () {
      console.log("Tim favorit berhasil disimpan.");
    })
    .catch(function () {
      console.log("Tim favorit tidak tersimpan.");
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function saveMatches(matches) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("matches", "readwrite");
      var store = tx.objectStore("matches");
      console.log(matches.match);
      store.add(matches.match);
      return tx.complete;
    })
    .then(function () {
      console.log("Jadwal berhasil disimpan.");
    })
    .catch(function () {
      console.log("Jadwal tidak tersimpan.");
    });
}