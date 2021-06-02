
"use strict";
//Display version
let CurrentCurseVersion = chrome.runtime.getManifest().version;

window.addEventListener("load", () => {
  CurrentCurseVersion = chrome.runtime.getManifest().version;
  const versionTxt = document.getElementById("versionNo");
  versionTxt.innerHTML = "Current version: " + CurrentCurseVersion;
});




/** Injects a function as plain code */
function InjectCode(tabId, func, callback) {
  let code = JSON.stringify(func.toString());
  code = code.slice(code.indexOf("{") + 1, code.length - 2);
  code = "var script = document.createElement(\"script\");" +
        "script.innerHTML = \"" + code + "\";" +
        "document.body.appendChild(script);";
  chrome.tabs.executeScript(tabId, { code: code },
    function () {
      if (callback)
        return callback.apply(this, arguments);
    });
}

/** Attaches a listener to a button and inserts the function to inject */
function buttonListener(id, fn) {
  document.getElementById(id).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      InjectCode(tabs[0].id, fn);
    });
  });
}

//Start
buttonListener("btnStart", CursedStarterBtn);

//Stop
buttonListener("btnStop", CursedStopper);

//Intense on/off
buttonListener("btnIntOn", CursedIntenseOn);
buttonListener("btnIntOff", CursedIntenseOff);

//Always on
buttonListener("btnAlwaysOn", AlwaysOnTurnOn);
buttonListener("btnAlwaysOff", AlwaysOnTurnOff);