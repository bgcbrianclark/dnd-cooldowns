/*****************
CHARACTER CONTROLLERS
*****************/
function createCharacter(name) {
  charactersList
    .doc(name)
    .set({
      active: true
    })
    .then(function() {
      location.reload();
    });
}

function deleteCharacter(char) {
  charactersList
    .doc(char)
    .delete()
    .then(function() {
      console.log("Character " + char + " has been deleted");
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
}

function buildCharacterName(char) {
  document.querySelector("#name h1").innerHTML = char.name;
}

function buildCharacterPage(char) {
  buildAbilityList(char);
}

/*****************
ABILITIES
*****************/
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

    tr.innerHTML = `
      <form action="">
        <td>${name}</td>
        <td><input type="number" value="${value}" /></td>
        <td class="mod"></td>
      </form>
    `;

    abilityList.querySelector("tbody").appendChild(tr);

    updateAbilityMod(tr, value);
  }
}
function updateAbility(char, trParent) {
  var name = trParent.classList[0];
  var value = parseInt(trParent.querySelector("input").value);

  charactersList.doc(char).set(
    {
      abilities: {
        [name]: value
      }
    },
    { merge: true }
  );

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

/*****************
SKILLS
*****************/
function createSkill(name, skill, rank, mod) {
  charactersList
    .doc(name)
    .set(
      {
        skills: {
          [skill]: {
            rank: rank,
            mod: mod
          }
        }
      },
      { merge: true }
    )
    .then(function() {
      location.reload();
      document.querySelector("#addNewSkillForm").style.display = "none";
    });
}

// First we grab the container
var skillsContainer = document.querySelector("#skills");

// Create a function to build out the skills based on the numbers for the selected character
function buildSkillList(char) {
  console.log(char.skills);
  if (Object.entries(char.skills).length) {
    var skills = Object.entries(char.skills);
  }

  // Loop through each skill and build a tr with tds
  for (var i = 0; i < skills.length; i++) {
    var name = skills[i][0],
      rank = skills[i][1].rank,
      mod = skills[i][1].mod,
      total = rank + mod;

    // build out skill table's innerHTML
    var body = skillsContainer.querySelector("tbody");
    var tr = document.createElement("tr");

    tr.innerHTML = `
      <form action="">
        <td><input type="text" value="${name}" /></td>
        <td><input type="number" value="${rank}" /></td>
        <td><input type="number" value="${mod}" /></td>
        <td>${total}</td>
        <td><button type="button">Edit</button></td>
      </form>
    `;
    body.appendChild(tr);
  }
}

/*****************
POWERS
*****************/

function createPower(name, power, description, cooldown) {
  charactersList
    .doc(name)
    .set(
      {
        powers: {
          [power]: {
            cooldown: cooldown,
            description: description,
            currentRound: 0
          }
        }
      },
      { merge: true }
    )
    .then(function() {
      location.reload();
      document.querySelector("#addNewSkillForm").style.display = "none";
    });
}

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
    <form data-id="${i}">
      <header>
        <h3 data-id="${name}"><input type="text" value="${name}" /> <button type="button">Edit</button></h3>
        <p><textarea>${description}</textarea></p>
        <p>Total Cooldown: <span><input type="number" value="${totalCooldown}"</span> Rounds</p>
      </header>
      <div class="skill-status">
        <p class="cooldown">Rounds to Ready: <span>${currentCooldown}</span></p>
        <p class="status">Status: <span>${status}</span> <button type="button" data-id="${i}">Use Skill</button></p>
      </div>
      <input type="submit" value="Finish Editing"/>
    </form>`;

    powersContainer.append(div);
  }
}

function editPower(char, form, name, description, cooldown) {
  charactersList.doc(char).set(
    {
      powers: {
        [name]: {
          description: description,
          cooldown: cooldown
        }
      }
    },
    { merge: true }
  );
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
    alert("Error: " + name + " isn't ready to use yet.");
  }
}

// Clear all cooldowns (for after fights)
function clearCooldowns(char) {
  var list = document.querySelectorAll(".power");
  list.forEach(power => {
    var name = power.querySelector("h3").getAttribute("data-id"),
      status = power.querySelector(".skill-status .status span"),
      cooldown = power.querySelector(".skill-status .cooldown span");

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

// Using the new round button, to sequence cooldowns
function newRound(char) {
  charactersList
    .doc(char)
    .get()
    .then(function(doc) {
      var list = document.querySelectorAll(".power");
      list.forEach(power => {
        var name = power.querySelector("h3").getAttribute("data-id");
        var status = power.querySelector(".skill-status .status span");
        var cooldown = parseInt(
          power.querySelector(".skill-status .cooldown span").innerHTML
        );
        var cooldownSpan = power.querySelector(".skill-status .cooldown span");

        // check if the cooldown is a word or number
        if (Number.isInteger(cooldown)) {
          // we have an integer
          if (cooldown > 0) {
            // -1 from cooldown and send to DB
            cooldown -= 1;
            cooldownSpan.innerHTML = cooldown;
            charactersList.doc(char).set(
              {
                powers: {
                  [name]: {
                    currentRound: cooldown
                  }
                }
              },
              { merge: true }
            );

            // if we're now at 0 we need to set the status
            if (cooldown == 0) {
              status.innerHTML = "Ready";
            }
          }
        } else {
          // we don't have an integer, set the cooldown back to an integer and set the status
          cooldown = doc.data().powers[name].cooldown;
          cooldownSpan.innerHTML = cooldown;
          status.innerHTML = "Waiting";
        }
      });
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
