charactersList.get().then(function() {
  var currentCharacter = characters[0];
  buildCharacterName(currentCharacter);
  var charName = currentCharacter.name;
  console.log(charName);
  buildCharacterPage(currentCharacter);
  buildSkillList(currentCharacter);
  buildPowersList(currentCharacter);

  document.querySelector(".is-loading").style.display = "none";

  var abInputs = document.querySelectorAll("#abilityScores input");
  abInputs.forEach(input => {
    const char = document.querySelector("h1").innerHTML;
    input.addEventListener("focusout", function() {
      updateAbility(char, this.parentNode.parentNode);
    });
  });

  var clearTimer = document.querySelector("#clear");
  clearTimer.addEventListener("click", function(e) {
    e.preventDefault();
    const char = document.querySelector("h1").innerHTML;
    clearCooldowns(char);
  });

  var newRoundBtn = document.querySelector("#newRound");
  newRoundBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const char = document.querySelector("h1").innerHTML;
    newRound(char);
  });

  var useSkillBtn = document.querySelectorAll(".power button");
  useSkillBtn.forEach(button => {
    button.addEventListener("click", function(e) {
      const char = document.querySelector("h1").innerHTML;
      var id = e.target.getAttribute("data-id");
      var power = document.querySelector('.power[data-id="' + id + '"]');
      usePower(char, power);
    });
  });

  var newSkillBtn = document.querySelector("#addNewSkill");
  newSkillBtn.addEventListener("click", function(e) {
    document.querySelector("#addNewSkillForm").style.display = "block";
  });
  var addSkillForm = document.querySelector("#addNewSkillForm");
  addSkillForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var name = addSkillForm.querySelector("#skillName").value,
      rank = addSkillForm.querySelector("#skillRank").value,
      mod = addSkillForm.querySelector("#skillMod").value;

    createSkill(charName, name, parseInt(rank), parseInt(mod));
  });

  var newPowerBtn = document.querySelector("#addNewPower");
  newPowerBtn.addEventListener("click", function() {
    document.querySelector("#addNewPowerForm").style.display = "block";
  });
  var addPowerForm = document.querySelector("#addNewPowerForm");
  addPowerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var name = addPowerForm.querySelector("#powerName").value,
      cooldown = addPowerForm.querySelector("#powerCooldown").value,
      description = addPowerForm.querySelector("#powerDescription").value;
    createPower(charName, name, description, cooldown);
  });

  var powerForms = document.querySelectorAll(".power form");
  powerForms.forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      var form = e.target;
      var name = form.querySelector('input[type="text"]').value,
        description = form.querySelector("textarea").value,
        cooldown = form.querySelector('input[type="number"]').value;
      editPower(charName, form, name, description, cooldown);
    });
  });
});
