// Variabler
const btn = document.getElementById('start-game');
const options = document.querySelectorAll('.options');
const highScore = document.getElementById('high-score');
const playersName = document.getElementById('your-name');

let choices = document.getElementById('choices');
let pScore = 0;
let cScore = 0;
let topFiveScores;

// URL från databas
const url = `https://highscore-1f3e1-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;

// Funktion som skickar spelarens poäng till databasen om poängen slår den lägsta nuvarande poängen på top 5
function sendToDataBase() {
  const databaseName = playersName.value;
  if (pScore > topFiveScores[4].score) {

    const addToHighScore = {
      name: databaseName,
      score: pScore
    };

    const headerObject = {
      "content-type": "application/json; charset=UTF-8"
    };

    const init = {
      method: 'POST',
      body: JSON.stringify(addToHighScore),
      headers: headerObject
    }

    fetch(url, init)
      .then(r => r.json())
      .then(d => {
        getHighscores()
        console.log('Post players score to database', d)
      });
  }

}

// Funktion som hämtar Top 5 highscore och sorteras i ordning från högst poäng till lägst
function getHighscores() {

  fetch(url)
    .then(r => r.json())
    .then(d => {
      // Returnerar en array av objekt från databasen
      const scoreArray = Object.values(d);
      scoreArray.sort((a, b) => {
        return b.score - a.score;
      })
      topFiveScores = scoreArray;
      highScore.innerHTML = '';

      for (i = 0; i < 5; i++) {
        const highscore = scoreArray[i]
        const li = document.createElement('li');
        highScore.appendChild(li);
        li.innerText = 'SPELARE: ' + ' ' + highscore.name + ' ' + 'POÄNG: ' + ' ' + highscore.score;

      }
    })
}
getHighscores()

// Gör så att namnet vi skriver in visas i h2-elementet under text-inputfältet
btn.addEventListener('click', function () {
  const input = document.querySelector('input');
  const h2 = document.getElementById('your-choice');

  h2.innerText = input.value + ' spelar just nu.';
  choices.textContent = 'Du börjar!';

  // Lägger till click-funktion på alla val och gör så att datorn slumpmässigt genererar ett av de tre
  options.forEach((option) => {
    option.addEventListener("click", function () {
      const pInput = this.value;
      const cOptions = ["Sten", "Påse", "Sax"];
      const cInput = cOptions[Math.floor(Math.random() * 3)];

      compareInputs(pInput, cInput);
      checkWinner();
      updateScore();
    });
  });

  // Om vi och datorn har valt samma så får ingen poäng
  function compareInputs(pInput, cInput) {
    const currentMatch = `${pInput} mot ${cInput}`;
    if (pInput === cInput) {
      choices.textContent = `${currentMatch} är lika. Kör igen!`;
      return;
    }

    // Vi listar olika scenarior beroende på val som vi gör/som datorn genererar och bestämmer vem som vinner/förlorar beroende på val av symbol
    if (pInput === "Sten") {
      if (cInput === "Sax") {
        choices.textContent = `${currentMatch} = Du vann den här rundan! ⭐`;
        pScore++;
      } else {
        choices.textContent = `${currentMatch} = Datorn bröt din streak! Ange namn igen och tryck på "börja spela" för revansch.`;
        cScore++;

      }
    }

    else if (pInput === "Påse") {
      if (cInput === "Sten") {
        choices.textContent = `${currentMatch} = Du vann den här rundan! ⭐`;
        pScore++;
      } else {
        choices.textContent = `${currentMatch} = Datorn bröt din streak! Ange namn igen och tryck på "börja spela" för revansch.`;
        cScore++;

      }
    }

    else {
      if (cInput === "Påse") {
        choices.textContent = `${currentMatch} = Du vann den här rundan! ⭐`;
        pScore++;
      } else {
        choices.textContent = `${currentMatch} = Datorn bröt din streak! Ange namn igen och tryck på "börja spela" för revansch.`;
        cScore++;

      }
    }
  }

  // Uppdaterar våra poäng i DOM:en (datorn når bara till 1 sen startas spelet om)
  function updateScore() {
    document.getElementById("p-score").textContent = pScore;
    document.getElementById("c-score").textContent = cScore;
  }

  // Fortsätt spelet fram tills att datorn vinner, då ska uppnådd poäng från spelaren sändas till databasen
  function checkWinner() {
    if (cScore === 1) {
      sendToDataBase();
      restartGame();
    }
    else {
      updateScore();
    }
    return true;
  }
})

// Resettar spelets poäng
function restartGame() {
  cScore = 0;
  pScore = 0;
}


