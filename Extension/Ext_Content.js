
window.addEventListener("load", () => {

  function AddScript(scriptFileName) {
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL(scriptFileName);
    return document.head.appendChild(script);
  }
  
  const scripts = [
    "Utils.js",
    "Curse/MainCurse.js",
    "Curse/Checks/SelfMessageCheck.js",
    "Curse/Checks/MessageCheck.js",
    "Curse/Checks/PunishmentCheck.js",
    "Curse/Checks/AppearanceCheck.js",
    "Curse/Functions/All.js",
    "Curse/Functions/ClubOwner.js",
    "Curse/Functions/Private.js",
    "Curse/Functions/Owner.js",
    "Curse/Functions/Mistress.js",
    "Curse/Functions/Public.js",
    "Curse/Functions/Wearer.js",
    "Curse/Utilities/ChatHandlers.js",
    "Curse/Utilities/Activators.js",
    "Curse/Utilities/AlteredFunctions.js",
    "Curse/Utilities/Helpers.js",
    "Curse/Utilities/Startup.js",
    "Curse/Constants/Punishments.js",
    "Curse/Constants/HelpMsg.js",
    "Curse/Constants/Tips.js",
    "Curse/Constants/CursedConfig.js",
    "Curse/Room/CursePreference.js",
    "Curse/Room/CurseRoom.js",
    "Curse/Room/WardrobeV2.js"
  ];
  
  scripts.forEach(AddScript);
});