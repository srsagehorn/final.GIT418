// all of the buttons on the page and whether or not they are collapsed

let features = [
  { name: "carsJS", collapsed: true },
  { name: "carsClass", collapsed: true },
  {name : "fam", collapsed: true},
  {name : "animals", collapsed: true}
];

// tutorial in motion!!
features.forEach((button) => {
  $(`#${button.name}`).on("click", function () {
    //   if the user is trying to run the  code
    // it changes the button name and starts the animation
    // then sets the collapse key to false
    // does the opposite if they are trying to close it
    if (button.collapsed) {
      $(`#${button.name}`).text("Reset");
      button.collapsed = false;
      $("#a" + button.name).removeAttr("style");
    } else {
      $(`#${button.name}`).text("Run");
      button.collapsed = true;
      $("#a" + button.name).attr("style", "display:none");
    }
  });
});


class FamilyMembers {
  constructors(name, age, relation) {
        this.name = name;
        this.age = age;
        this.relation = relation;
          }
        }

let auntBetty = new FamilyMembers("Betty", 57, "aunt")
let uncleRoger = new FamilyMembers("Roger", 58, "Uncle")
let cousinJen = new FamilyMembers("Jen", 23, "Cousin")
let stepmomJulie = new FamilyMembers("Julie", 46, "Step Mom")

console.log (auntBetty, uncleRoger, cousinJen, stepmomJulie)