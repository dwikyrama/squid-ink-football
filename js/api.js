var base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/standings").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var standingsHTML = "";
          data.standings[0].table.forEach(function (standing) {
            standingsHTML += `
              <tr>
                  <td>${standing.position}.</td>
                  <td>${standing.team.name}</td>
                  <td>${standing.playedGames}</td>
                  <td>${standing.won}</td>
                  <td>${standing.draw}</td>
                  <td>${standing.lost}</td>
                  <td>${standing.goalsFor}</td>
                  <td>${standing.goalsAgainst}</td>
                  <td>${standing.goalDifference}</td>
                  <td>${standing.points}</td>
              </tr>
            `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("standings").innerHTML = standingsHTML;
        })
      }
    })
  }
  fetch(base_url + "competitions/PL/standings", {
    headers:{'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0'}
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      var standingsHTML = "";
      data.standings[0].table.forEach(function (standing) {
          standingsHTML += `
            <tr>
                <td>${standing.position}.</td>
                <td>${standing.team.name}</td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("standings").innerHTML = standingsHTML;
    })
    .catch(error);
}

function getTeams() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/teams").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var teamsHTML = "";
          data.teams[0].table.forEach(function (team) {
            teamsHTML += `
              <tr>
                  <td>${team.position}.</td>
                  <td>${team.team.name}</td>
                  <td>${team.playedGames}</td>
                  <td>${team.won}</td>
                  <td>${team.draw}</td>
                  <td>${team.lost}</td>
                  <td>${team.goalsFor}</td>
                  <td>${team.goalsAgainst}</td>
                  <td>${team.goalDifference}</td>
                  <td>${team.points}</td>
              </tr>
            `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        })
      }
    })
  }
  fetch(base_url + "competitions/PL/teams", {
    headers:{'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0'}
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      data.teams.forEach(function (team) {
          teamsHTML += `
            <div class="col s12 m6 l4">
              <div class="card">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${team.crestUrl}">
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${team.name}</span>
                      <p>Founded: ${team.founded}</p>
                  </div>
                  <div class="card-reveal blue darken-4 white-text">
                      <span class="card-title">${team.name}<i class="material-icons right">close</i></span>
                      <p><small>Website: <b>${team.website}</b></small></p>
                      <p><small>Phone: <b>${team.phone}</b></small></p>
                      <p><small>Email: <b>${team.email}</b></small></p>
                      <p><small>Venue: <b>${team.venue}</b></small></p>
                      <p><small>Address: <b>${team.address}</b></small></p>
                  </div>
              </div>  
            </div>  
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    if ("caches" in window) {
      caches.match(base_url + "article/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            var articleHTML = `
                <div class="card">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.result.cover}" />
                  </div>
                  <div class="card-content">
                    <span class="card-title">${data.result.post_title}</span>
                    ${snarkdown(data.result.post_content)}
                  </div>
                </div>
              `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }
    fetch(base_url + "article/" + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  getAll().then(function(articles) {
    console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    var articlesHTML = "";
    articles.forEach(function(article) {
      var description = article.post_content.substring(0,100);
      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.ID}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.post_title}</span>
                      <p>${description}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(article) {
    articleHTML = '';
    var articleHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${article.cover}" />
      </div>
      <div class="card-content">
        <span class="card-title">${article.post_title}</span>
        ${snarkdown(article.post_content)}
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}