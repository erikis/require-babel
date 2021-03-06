import main from './src/main.js';

function launch() {
  main(document.querySelector("#container"));
}
function loaded() {
  if (typeof APP_LAUNCH_DELAY === "undefined" || APP_LAUNCH_DELAY === 0) {
    launch();
  } else {
    console.log("Delaying app launch by " + APP_LAUNCH_DELAY + " ms");
    window.setTimeout(function() {
      launch();
    }, APP_LAUNCH_DELAY);
  }
}
if (document.readyState === "complete") {
  loaded();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    loaded();
  });
}

