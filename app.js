var db = firebase.firestore();

var docRef = db.collection("characters").doc("lee");

db.collection("characters")
  .where("active", "==", true)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });

docRef
  .get()
  .then(function(doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch(function(error) {
    console.log("Error getting document:", error);
  });

const app = document.querySelector("#app");

var characterName = "Lee";
document.querySelector("h1").innerHTML = characterName;

const abilityContainer = document.querySelector("#abilityScores tbody");
var abilityScores = [
  {
    ability: "STR",
    score: 5
  },
  {
    ability: "DEX",
    score: 10
  },
  {
    ability: "CON",
    score: 10
  },
  {
    ability: "INT",
    score: 10
  },
  {
    ability: "WIS",
    score: 10
  },
  {
    ability: "CHA",
    score: 10
  }
];

function fillAbilities() {
  abilityContainer.innerHTML = "";
  for (var i = 0; i < abilityScores.length; i++) {
    var currentAbility = abilityScores[i];

    var row = document.createElement("tr");

    ability = currentAbility.ability;
    score = parseInt(currentAbility.score);

    modifier = Math.floor((score - 10) / 2);

    if (modifier > 0) {
      modifier = "+" + modifier;
    }

    row.innerHTML = `<td>${ability}</td>
    <td>${score}</td>
    <td>${modifier}</td>`;

    abilityContainer.append(row);
  }
}
fillAbilities();

// TODO: add ability edit feature
const abilityFormBtn = document.querySelector("#editAbilityScores");
const abilityForm = document.querySelector("#editAbilities");
var abilitySelect = document.querySelector("#editAbility");
var abilityInput = document.querySelector("#newAbiltiy");

abilityFormBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (abilityForm.style.display == "none") {
    abilityForm.style.display = "block";
  } else {
    abilityForm.style.display = "none";
  }
});

function updateAbility(ability) {
  for (var i = 0; i < abilityScores.length; i++) {
    console.log(
      "ability = " +
        ability +
        " " +
        " ability name = " +
        abilityScores[i].ability
    );
    if (abilityScores[i].ability == ability) {
      abilityScores[i].score = abilityInput.value;
      abilityForm.reset();
      fillAbilities();
      break;
    }
  }
}
abilityForm.addEventListener("submit", function(e) {
  e.preventDefault();
  updateAbility(abilitySelect.value);
});

// Skill points
const skillContainer = document.querySelector("#skills");
var skills = [
  {
    name: "Climb",
    points: 1,
    mod: 0
  },
  {
    name: "Jump",
    points: 2,
    mod: 1
  }
];
function fillSkills() {
  for (var i = 0; i < skills.length; i++) {
    const currentSkill = skills[i];

    var row = document.createElement("tr");

    name = currentSkill.name;
    points = parseInt(currentSkill.points);
    mod = parseInt(currentSkill.mod);
    total = points + mod;

    row.innerHTML = `
      <td>${name}</td>
      <td>${points}</td>
      <td>${mod}</td>
      <td class="total">${total}</td>
      <td><button class="edit">Edit</button></td>`;

    skillContainer.append(row);
  }
}
fillSkills();

// Powers and Cooldowns
var powersContainer = document.getElementById("powersList");
var powers = [
  {
    name: "Fireball",
    description:
      "Explosive fireball in a 4x4 square area. 3d6 damage, reflex save for half.",
    totalRounds: 3,
    cooldown: 3,
    status: "Waiting"
  },
  {
    name: "Lightning Bolt",
    description:
      "Target one creature for 5d6 damage, reflex save for no damage",
    totalRounds: 3,
    cooldown: 2,
    status: "Waiting"
  }
];

function fillPowers() {
  powersContainer.innerHTML = "";
  for (var i = 0; i < powers.length; i++) {
    var currentPower = powers[i];

    if (currentPower.cooldown < 1) {
      currentPower.status = "Ready";
    }

    var div = document.createElement("div");
    div.classList.add("power");
    div.setAttribute("data-id", i);
    div.innerHTML = `
    <header>
      <h3>${currentPower.name} <button data-id="${i}">Use Skill</button></h3>
      <p>${currentPower.description}</p>
      <p>Total Cooldown: <span>${currentPower.totalRounds}</span> Rounds</p>
    </header>
    <div class="status">
      <p>Rounds to Ready: <span>${currentPower.cooldown}</span></p>
      <p>Status: <span>${currentPower.status}</span></p>
    </div>`;

    powersContainer.append(div);

    var useSkillBtn = document.querySelectorAll(".power button");
    useSkillBtn.forEach(button => {
      button.addEventListener("click", function(e) {
        var id = e.target.getAttribute("data-id");
        var power = powers[id];
        console.log(id);
        if (power.cooldown == 0) {
          power.cooldown = "In Use";
        }

        fillPowers();
      });
    });
  }
}
fillPowers();

function clearCooldowns() {
  for (var i = 0; i < powers.length; i++) {
    powers[i].cooldown = 0;
  }
  fillPowers();
}

var clearTimer = document.querySelector("#clear");
clearTimer.addEventListener("click", function(e) {
  e.preventDefault();
  clearCooldowns();
});

function newRound() {
  for (var i = 0; i < powers.length; i++) {
    var power = powers[i];

    if (power.cooldown < 1) {
      powers[i].status = "Ready";
    } else if (power.cooldown == "In Use") {
      power.cooldown = power.totalRounds;
    } else {
      powers[i].cooldown = power.cooldown - 1;
    }
  }
  fillPowers();
}

var newRoundBtn = document.querySelector("#newRound");
newRoundBtn.addEventListener("click", function(e) {
  e.preventDefault();
  newRound();
});
