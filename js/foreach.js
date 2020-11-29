// all of the buttons on the page and whether or not they are collapsed

let features = [
  { name: "forloop", collapsed: true },
  { name: "fruits", collapsed: true },
  { name: "days", collapsed: true },
  { name: "nums", collapsed: true },
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
