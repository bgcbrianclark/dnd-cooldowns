// build ability list
function buildAbilityList(char) {
  const abilityNames = Object.keys(char.abilities);
  const abilityValues = Object.values(char.abilities);
  const abilityList = document.querySelector("#abilityScores");
  abilityList.querySelector("tbody").innerHTML = "";

  for (var i = 0; i < abilityValues.length; i++) {
    var name = abilityNames[i];
    var value = abilityValues[i];

    var tr = document.createElement("tr");
    tr.classList.add(name);

    var tdName = document.createElement("td");
    tdName.innerHTML = name;

    var tdInput = document.createElement("td");
    var input = document.createElement("input");
    input.setAttribute("value", value);
    input.setAttribute("type", "tel");
    input.setAttribute("maxlength", "2");
    tdInput.appendChild(input);

    var tdMod = document.createElement("td");
    tdMod.classList.add("mod");

    tr.appendChild(tdName);
    tr.appendChild(tdInput);
    tr.appendChild(tdMod);
    abilityList.querySelector("tbody").appendChild(tr);

    updateAbilityMod(tr, value);
  }
}
function updateAbility(trParent) {
  var name = trParent.classList[0];
  var value = trParent.querySelector("input").value;

  updateAbilityMod(trParent, value);
}

// ability mod function
function updateAbilityMod(target, score) {
  var mod = target.querySelector(".mod");
  var modScore = Math.floor((score - 10) / 2);
  if (modScore >= 0) {
    modScore = "+ " + modScore;
  } else {
    modScore = "- " + Math.abs(modScore);
  }
  mod.innerHTML = modScore;
}

function createCharacter(name) {
  characters.doc(name).set({
    name: name
  });
}

function setAbility(name, ability, value) {
  characters.doc(name).set(
    {
      abilities: {
        ability: value
      }
    },
    { merge: true }
  );
}

function setSkill(name, skill, rank, mod) {
  characters.doc(name).set(
    {
      skills: {
        name: skill,
        rank: rank,
        mod: mod
      }
    },
    { merge: true }
  );
}

function setPower(name, power, description, cooldown) {
  characters.doc(name).set(
    {
      powers: {
        cooldown: cooldown,
        name: power,
        description: description
      }
    },
    { merge: true }
  );
}

// First we grab the container
var skillsContainer = document.querySelector("#skills");

// Create a function to build out the skills based on the numbers for the selected character
function buildSkillList(char) {
  if (Object.entries(char.skills).length) {
    var skills = Object.entries(char.skills);
  }

  // Loop through each skill and build a tr with tds
  for (var i = 0; i < skills.length; i++) {
    var name = skills[i][0];
    var rank = skills[i][1].rank;
    var mod = skills[i][1].mod;
    var total = rank + mod;

    // build out skill table's innerHTML
    var body = skillsContainer.querySelector("tbody");
    var tr = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdRank = document.createElement("td");
    var tdMod = document.createElement("td");
    var tdTotal = document.createElement("td");
    tdName.innerHTML = name;
    tdRank.innerHTML = rank;
    tdMod.innerHTML = mod;
    tdTotal.innerHTML = rank + mod;
    tr.appendChild(tdName);
    tr.appendChild(tdRank);
    tr.appendChild(tdMod);
    tr.appendChild(tdTotal);
    body.appendChild(tr);
  }
}

// POWERS

// grab the container
var powersContainer = document.querySelector("#powersList");

// build the list of powers
function buildPowersList(char) {
  var list = Object.entries(char.powers);

  // clear the current powers list so we can refresh it
  powersContainer.innerHTML = "";

  // loop through each power for the current character
  for (var i = 0; i < list.length; i++) {
    var currentPower = list[i],
      name = currentPower[0],
      description = currentPower[1].description,
      totalCooldown = currentPower[1].cooldown,
      currentCooldown = currentPower[1].currentRound,
      status = "Ready";

    // reset status if the power isn't ready yet
    if (currentCooldown > 0) {
      status = "Waiting";
    }

    // build out the html for the power and append it to the main container
    var div = document.createElement("div");
    div.classList.add("power");
    div.setAttribute("data-id", i);
    div.innerHTML = `
    <header>
      <h3 data-id="${name}">${name} <button data-id="${i}">Use Skill</button></h3>
      <p>${description}</p>
      <p>Total Cooldown: <span>${totalCooldown}</span> Rounds</p>
    </header>
    <div class="skill-status">
      <p class="cooldown">Rounds to Ready: <span>${currentCooldown}</span></p>
      <p class="status">Status: <span>${status}</span></p>
    </div>`;

    powersContainer.append(div);
  }
}

// using a power
function usePower(char, power) {
  // get the power ID so we can reference it later
  var name = power.querySelector("h3").getAttribute("data-id");
  var cooldown = parseInt(
    power.querySelector(".skill-status .cooldown span").innerHTML
  );

  if (cooldown < 1) {
    // set the power's status to In Use so it can't be used, and has a round before it has a cooldown
    power.querySelector(".skill-status .cooldown span").innerHTML = "In Use";
    power.querySelector(".skill-status .status span").innerHTML = "In Use";

    // get and set the current round in the DB
    var totalCooldown;
    charactersList
      .doc(char)
      .get()
      .then(function(doc) {
        totalCooldown = doc.data().powers[name].cooldown;
        charactersList.doc(char).set(
          {
            powers: {
              [name]: {
                currentRound: totalCooldown + 1
              }
            }
          },
          { merge: true }
        );
      });
  } else {
    console.warn("skill is not ready yet!");
  }
}

function clearCooldowns(char) {
  var list = document.querySelectorAll(".power");
  list.forEach(power => {
    var name = power.querySelector("h3").getAttribute("data-id");
    var status = power.querySelector(".skill-status .status span");
    var cooldown = power.querySelector(".skill-status .cooldown span");

    status.innerHTML = "Ready";
    cooldown.innerHTML = 0;

    status.innerHTML = "Ready";
    cooldown.innerHTML = 0;
    charactersList.doc(char).set(
      {
        powers: {
          [name]: {
            currentRound: 0
          }
        }
      },
      { merge: true }
    );
  });
}

function newRound(char) {
  var list = document.querySelectorAll(".power");
  list.forEach(power => {
    var name = power.querySelector("h3").getAttribute("data-id");
    var status = power.querySelector(".skill-status .status span");
    var cooldown = power.querySelector(".skill-status .cooldown span")
      .innerHTML;

    // check if the cooldown is a word or number
    if (Number.isInteger(cooldown)) {
      // we have an integer
      charactersList
        .doc(char)
        .get()
        .then(function(doc) {
          if (cooldown > 0) {
            charactersList.doc(char).set(
              {
                powers: {
                  [name]: {
                    currentRound: doc.data().powers[name].currentRound - 1
                  }
                }
              },
              { merge: true }
            );
            cooldown = doc.data().powers[name].currentRound;
            console.log("was an integer, is now: " + parseInt(cooldown));
            buildPowersList(doc.data().id);
          }
        });
    } else {
      // we don't have an integer
      charactersList
        .doc(char)
        .get()
        .then(function(doc) {
          cooldown = doc.data().powers[name].cooldown;
          console.log("wasn't an integer, is now: " + parseInt(cooldown));
        });
      buildPowersList(toString(char));
    }
  });
}

function buildCharacterList() {
  var characterSelect = document.createElement("select");
  var option = document.createElement("option");
  option.innerHTML = "Select a Character";
  characterSelect.appendChild(option);

  app.insertBefore(characterSelect, document.querySelector("#name"));

  for (var i = 0; i < characters.length; i++) {
    var char = characters[i];
    var addCharacter = document.createElement("option");
    addCharacter.setAttribute("value", char.name);
    addCharacter.text = char.name;

    characterSelect.appendChild(addCharacter);
  }
}

function buildCharacterName(char) {
  document.querySelector("#name h1").innerHTML = char.name;
}

function buildCharacterPage(char) {
  buildAbilityList(char);
}
