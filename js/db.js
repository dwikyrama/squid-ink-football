// bagian ini beda dari codelab, okay
var dbPromised = idb.open('footballDB', 1, upgradeDb => {  
  var articleObjectStore = upgradeDb.createObjectStore('articles', {    
      keyPath: 'ID'  
  });  
  articleObjectStore.createIndex('post_title', 'post_title', {unique: false});
});

function saveForLater(article) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("articles", "readwrite");
            var store = tx.objectStore("articles");
            console.log(article);
            store.add(article.result);
            return tx.complete;
        })
        .then(function () {
            console.log("Artikel berhasil disimpan.");
        })
        .catch(function () {
            console.log("Artikel tidak tersimpan.");
        });
}

function getAll() {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("articles", "readonly");
          var store = tx.objectStore("articles");
          return store.getAll();
        })
        .then(function(articles) {
          resolve(articles);
        });
    });
  }