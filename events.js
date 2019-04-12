charactersList.get().then(function() {
  buildCharacterName(characters[2]);
  buildCharacterPage(characters[2]);
  buildSkillList(characters[2]);
  buildPowersList(characters[2]);

  document.querySelector(".is-loading").style.display = "none";

  var abInputs = document.querySelectorAll("#abilityScores input");
  abInputs.forEach(input => {
    input.addEventListener("focusout", function() {
      updateAbility(this.parentNode.parentNode);
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
});
