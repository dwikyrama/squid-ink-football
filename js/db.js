// bagian ini beda dari codelab, okay
var dbPromised = idb.open('footballDB', 1, upgradeDb => {  
  var teamObjectStore = upgradeDb.createObjectStore('teams', {    
      keyPath: 'id'  
  });  
  teamObjectStore.createIndex('shortName', 'shortName', {unique: false});
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
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("teams", "readonly");
          var store = tx.objectStore("teams");
          return store.getAll();
        })
        .then(function(articles) {
          resolve(articles);
        });
    });
  }