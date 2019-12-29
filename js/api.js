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
    caches.match(base_url + "competitions/PL/standings?standingType=TOTAL").then(function (response) {
      if (response) {
        response.json().then(function (data) {
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
          // Sisipkan komponen tabel ke dalam elemen dengan id #standings
          document.getElementById("standings").innerHTML = standingsHTML;
        })
      }
    })
  }

  fetch(base_url + "competitions/PL/standings?standingType=TOTAL", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Blok kode untuk menyusun komponen tabel standing
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
      // Sisipkan komponen tabel ke dalam elemen dengan id #standings
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
      }
    })
  }
  fetch(base_url + "competitions/PL/teams", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
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

// Blok kode untuk mengambil data jadwal pertandingan terkini
function getMatchday() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          caches.match(base_url + "competitions/PL/matches?matchday=" + data.currentSeason.currentMatchday).then(function (response) {
            if (response) {
              response.json().then(function (data) {
                var lastUpdatedHTML = "";
                lastUpdatedHTML = `
                  Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
                `;

                var dropdownHTML = "";
                dropdownHTML = `
                  Matchday ${data.matches[0].matchday}
                `;

                var matchesHTML = "";
                data.matches.forEach(function (match) {
                  var score;
                  if (match.score.fullTime.homeTeam) {
                    score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
                  } else {
                    score = "-:-";
                  }
                  var day = new Date(match.utcDate).toString();

                  matchesHTML += `
                    <tr>
                      <td>
                        ${day.slice(8, 10)} 
                        ${day.slice(4, 7)} 
                        ${day.slice(11, 15)}
                      </td>
                      <td>${day.slice(16, 21)}</td>
                      <td>${match.status}</td>
                      <td class="right-align">${match.homeTeam.name}</td>
                      <td class="center-align">${score}</td>
                      <td>${match.awayTeam.name}</td>
                    </tr>
                    `;
                });
                // Sisipkan komponen ke dalam elemen menurut id
                document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
                document.getElementById("dropdown-text").innerHTML = dropdownHTML;
                document.getElementById("matches").innerHTML = matchesHTML;
              })
            }
          })
        })
      }
    })
  }

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

          var lastUpdatedHTML = "";
          lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

          var dropdownHTML = "";
          dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

          var matchesHTML = "";
          data.matches.forEach(function (match) {
            var score;
            if (match.score.fullTime.homeTeam) {
              score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
            } else {
              score = "-:-";
            }

            // Get local time
            var day = new Date(match.utcDate).toString();

            matchesHTML += `
                <tr>
                  <td>
                    ${day.slice(8, 10)} 
                    ${day.slice(4, 7)} 
                    ${day.slice(11, 15)}
                  </td>
                  <td>${day.slice(16, 21)}</td>
                  <td>${match.status}</td>
                  <td class="right-align">${match.homeTeam.name}</td>
                  <td class="center-align">${score}</td>
                  <td>${match.awayTeam.name}</td>
                </tr>
                `;
          });

          // Sisipkan komponen ke dalam elemen menurut id
          document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
          document.getElementById("dropdown-text").innerHTML = dropdownHTML;
          document.getElementById("matches").innerHTML = matchesHTML;

        })
        .catch(error);
    }).catch(error);
}

// Blok kode untuk mengambil data jadwal pertandingan menurut hari
function getMatchesByDay() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("matchday");

  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/matches?matchday=" + idParam).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var lastUpdatedHTML = "";
          lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

          var dropdownHTML = "";
          dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

          var matchesHTML = "";
          data.matches.forEach(function (match) {
            var score;
            if (match.score.fullTime.homeTeam) {
              score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
            } else {
              score = "-:-";
            }

            var day = new Date(match.utcDate).toString();

            matchesHTML += `
                <tr>
                  <td>
                    ${day.slice(8, 10)} 
                    ${day.slice(4, 7)} 
                    ${day.slice(11, 15)}
                  </td>
                  <td>${day.slice(16, 21)}</td>
                  <td>${match.status}</td>
                  <td class="right-align">${match.homeTeam.name}</td>
                  <td class="center-align">${score}</td>
                  <td>${match.awayTeam.name}</td>
                </tr>
                `;
          });
          // Sisipkan komponen ke dalam elemen menurut id
          document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
          document.getElementById("dropdown-text").innerHTML = dropdownHTML;
          document.getElementById("matches").innerHTML = matchesHTML;
        })
      }
    })
  }

  fetch(base_url + "competitions/PL/matches?matchday=" + idParam, {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      var lastUpdatedHTML = "";
      lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

      var dropdownHTML = "";
      dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

      var matchesHTML = "";
      data.matches.forEach(function (match) {
        var score;
        if (match.score.fullTime.homeTeam) {
          score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
        } else {
          score = "-:-";
        }

        var day = new Date(match.utcDate).toString();

        matchesHTML += `
                <tr>
                  <td>
                    ${day.slice(8, 10)} 
                    ${day.slice(4, 7)} 
                    ${day.slice(11, 15)}
                  </td>
                  <td>${day.slice(16, 21)}</td>
                  <td>${match.status}</td>
                  <td class="right-align">${match.homeTeam.name}</td>
                  <td class="center-align">${score}</td>
                  <td>${match.awayTeam.name}</td>
                </tr>
                `;
      });
      // Sisipkan komponen ke dalam elemen menurut id
      document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
      document.getElementById("dropdown-text").innerHTML = dropdownHTML;
      document.getElementById("matches").innerHTML = matchesHTML;
    })
    .catch(error);
}

// Blok kode untuk menambahkan opsi hari pertandingan dalam dropdown
function getMatchdayDropdown() {
  var day;
  var matchdayHTML = "";
  for (day = 1; day < 39; day++) {
    matchdayHTML += `<li><a href="./match_info.html?matchday=${day}">Matchday ${day}</a></li>`;
  }
  document.getElementById("matchday-dropdown").innerHTML = matchdayHTML;
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("team_id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
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

            var playerHTML = "";
            data.squad.forEach(function (player) {
              var shirtNumber = "";
              if (player.shirtNumber) {
                shirtNumber = player.shirtNumber;
              }

              if (player.role == "PLAYER") {
                var dob = new Date(player.dateOfBirth).toUTCString();
                playerHTML += `
                  <tr>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td class="center-align">${shirtNumber}</td>
                    <td class="right-align">
                      ${dob.slice(5, 16)} 
                    </td>
                    <td>${player.nationality}</td>
                  </tr>
                `;
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
                <th class="center-align">Shirt Number</th>
                <th class="right-align">DOB</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
        `;
            // Sisipkan komponen tabel ke dalam elemen dengan id #body-content
            document.getElementById("body-content").innerHTML = teamHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "teams/" + idParam, {
      headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
    })
      .then(status)
      .then(json)
      .then(function (data) {
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

        var playerHTML = "";
        data.squad.forEach(function (player) {
          var shirtNumber = "";
          if (player.shirtNumber) {
            shirtNumber = player.shirtNumber;
          }

          if (player.role == "PLAYER") {
            var dob = new Date(player.dateOfBirth).toUTCString();
            playerHTML += `
              <tr>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td class="center-align">${shirtNumber}</td>
                <td class="right-align">
                  ${dob.slice(5, 16)} 
                </td>
                <td>${player.nationality}</td>
              </tr>
            `;
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
                <th class="center-align">Shirt Number</th>
                <th class="right-align">DOB</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
        `;

        // Sisipkan komponen tabel ke dalam elemen dengan id #body.content
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getFavoriteTeams() {
  getAll().then(function(data) {
    console.log(data);
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
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("teams").innerHTML = teamsHTML;
  });
}

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