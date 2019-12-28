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

// Blok kode untuk mengambil data standing (ranking pertandingan)
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
  fetch(base_url + "competitions/PL/standings?standingType=TOTAL", {
    headers:{'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0'}
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Blok kode untuk menampilkan tabel standing
      var standingsHTML = "";
      data.standings[0].table.forEach(function (standing) {
          standingsHTML += `
            <tr>
                <td>${standing.position}</td>
                <td>
                  <img class="standing-img" src="${standing.team.crestUrl}" />
                </td>
                <td class="align-left-td">
                  <a href="./team_info.html?team_id=${standing.team.id}">
                    ${standing.team.name}
                  </a>
                </td>
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

// Blok kode untuk mengambil data tim
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
                  <a href="./team_info.html?team_id=${team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${team.crestUrl}">
                  </div>
                  </a>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${team.name}</span>
                      <p>Founded: ${team.founded}</p>
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


// Blok kode untuk mengambil data jadwal pertandingan
function getMatchday() {
  fetch(base_url + "competitions/PL", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      fetch(base_url + "competitions/PL/matches?matchday=" + data.currentSeason.currentMatchday, {
        headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
      })
        .then(status)
        .then(json)
        .then(function (data) {
          // Objek/array JavaScript dari response.json() masuk lewat data.
    
          var matchesHTML = "";
          data.matches.forEach(function (match) {
            var score;
            if (match.score.fullTime.homeTeam) {
              score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
            } else {
              score = "-:-";
            }
    
            matchesHTML += `
                <tr>
                  <td>${match.matchday}</td>
                  <td>${match.utcDate}</td>
                  <td>${match.status}</td>
                  <td>${match.homeTeam.name}</td>
                  <td>${score}</td>
                  <td>${match.awayTeam.name}</td>
                </tr>
                `;
          });
          // Sisipkan komponen tabel ke dalam elemen dengan id #content
          document.getElementById("matches").innerHTML = matchesHTML;
        })
        .catch(error);
   }).catch(error);
  
  // Blok kode untuk menambahkan opsi matchday dalam dropdown
  var day;
  var matchdayHTML = "";
  for (day=1; day<39; day++) {
    matchdayHTML += `<li><a href="./match_info.html?matchday=${day}">Matchday ${day}</a></li>`;
  }
  document.getElementById("matchday-dropdown").innerHTML = matchdayHTML;
}

function getMatchesByDay() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/matches").then(function (response) {
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

  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("matchday");

  fetch(base_url + "competitions/PL/matches?matchday=" + idParam, {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      var matchesHTML = "";
      data.matches.forEach(function (match) {
        var score;
        if (match.score.fullTime.homeTeam) {
          score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
        } else {
          score = "-:-";
        }

        matchesHTML += `
            <tr>
              <td>${match.matchday}</td>
              <td>${match.utcDate}</td>
              <td>${match.status}</td>
              <td>${match.homeTeam.name}</td>
              <td>${score}</td>
              <td>${match.awayTeam.name}</td>
            </tr>
            `;
      });
      // Sisipkan komponen tabel ke dalam elemen dengan id #content
      document.getElementById("matches").innerHTML = matchesHTML;
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("team_id");
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
    fetch(base_url + "teams/" + idParam, {
      headers:{'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0'}
    })
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var teamHTML = `
          <h3>${data.name}</h3>
          <div class="row">
            <div class="col s12 m4 l3">
              <img class="team-info-img" src="${data.crestUrl}" />
            </div>
            <div class="col s12 m8 l9">
                <ul class="collection">
                    <li class="collection-item">Founded <b>${data.founded}</b></li>
                    <li class="collection-item">Phone <b>${data.phone}</b></li>
                    <li class="collection-item">Email <b>${data.email}</b></li>
                    <li class="collection-item">Website <b>${data.website}</b></li>
                    <li class="collection-item">Address <b>${data.address}</b></li>
                </ul>
            </div>
          </div>       
        `;
        
        // data.activeCompetitions.forEach(function (activeComp) {
        //   teamHTML += `
        //     <p>Competition ${activeComp.name}</p>            
        //   `;
        // })

        var playerHTML = "";
        data.squad.forEach(function (player) {
          var shirtNumber = "";
          if(player.shirtNumber) {
            shirtNumber = player.shirtNumber;
          }
        
          if(player.role == "PLAYER") {
            playerHTML += `
              <tr>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td>${shirtNumber}</td>
                <td>${player.dateOfBirth}</td>
                <td>${player.nationality}</td>
              </tr>
            `
          }
        });

        teamHTML += `
        <h5>Players</h5>
        <hr />  
        <table class="highlight">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Shirt Number</th>
                <th>DOB</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
          <br />
        `;

        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

// function getSavedArticles() {
//   getAll().then(function(articles) {
//     console.log(articles);
//     // Menyusun komponen card artikel secara dinamis
//     var articlesHTML = "";
//     articles.forEach(function(article) {
//       var description = article.post_content.substring(0,100);
//       articlesHTML += `
//                   <div class="card">
//                     <a href="./article.html?id=${article.ID}&saved=true">
//                       <div class="card-image waves-effect waves-block waves-light">
//                         <img src="${article.cover}" />
//                       </div>
//                     </a>
//                     <div class="card-content">
//                       <span class="card-title truncate">${article.post_title}</span>
//                       <p>${description}</p>
//                     </div>
//                   </div>
//                 `;
//     });
//     // Sisipkan komponen card ke dalam elemen dengan id #body-content
//     document.getElementById("body-content").innerHTML = articlesHTML;
//   });
// }

// function getSavedArticleById() {
//   var urlParams = new URLSearchParams(window.location.search);
//   var idParam = urlParams.get("id");
  
//   getById(idParam).then(function(article) {
//     articleHTML = '';
//     var articleHTML = `
//     <div class="card">
//       <div class="card-image waves-effect waves-block waves-light">
//         <img src="${article.cover}" />
//       </div>
//       <div class="card-content">
//         <span class="card-title">${article.post_title}</span>
//         ${snarkdown(article.post_content)}
//       </div>
//     </div>
//   `;
//     // Sisipkan komponen card ke dalam elemen dengan id #content
//     document.getElementById("body-content").innerHTML = articleHTML;
//   });
// }

// function getById(id) {
//   return new Promise(function(resolve, reject) {
//     dbPromised
//       .then(function(db) {
//         var tx = db.transaction("articles", "readonly");
//         var store = tx.objectStore("articles");
//         return store.get(id);
//       })
//       .then(function(article) {
//         resolve(article);
//       });
//   });
// }