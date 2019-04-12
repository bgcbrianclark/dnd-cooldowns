/****
INITIALIZE APP AND SET UP DATABASE HOOK
****/
const app = document.querySelector("#app");
var db = firebase.firestore();

// set db collection
var charactersList = db.collection("characters");

/****
Get all characters from the database
****/

// build characters
var characters = [];

charactersList.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    var character = {};

    character.name = doc.id;

    if (doc.data().abilities) {
      character.abilities = doc.data().abilities;
    } else {
      character.abilities = {
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHA: 10
      };
      charactersList.doc(doc.id).set(
        {
          abilities: {
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10
          }
        },
        { merge: true }
      );
    }
    if (doc.data().skills) {
      character.skills = doc.data().skills;
    } else {
      character.skills = {
        Default: {
          rank: 0,
          mod: 0
        }
      };
      charactersList.doc(doc.id).set(
        {
          skills: {
            Default: {
              rank: 0,
              mod: 0
            }
          }
        },
        { merge: true }
      );
    }
    if (doc.data().powers) {
      character.powers = doc.data().powers;
    } else {
      character.powers = {
        Default: {
          description:
            "This is the default power made upon character creation. Edit it.",
          cooldown: 1,
          currentRound: 0
        }
      };
      charactersList.doc(doc.id).set(
        {
          powers: {
            Default: {
              description:
                "This is the default power made upon character creation. Edit it.",
              cooldown: 1,
              currentRound: 0
            }
          }
        },
        { merge: true }
      );
    }
    characters.push(character);
    console.log("adding character " + character.name + " to array");
  });
});
